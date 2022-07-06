let alist = [];
let sitemap = [];
let max_depth = 0;
let toggle = 0;
const input = document.getElementById("inputFile");
const output = document.getElementById("output");
const layer_container = document.getElementById("layer_container");


// const canvas = document.getElementById('layer_canvas');
// const ctx = canvas.getContext("2d");

// ctx.beginPath()
// ctx.moveTo(1000,1000);
// ctx.lineTo(1200,1200);
// ctx.stroke()

// 1. 텍스트 파일을 읽어온다.
// 2. 읽어온 텍스트 파일을 "\n" 으로 구분해서 배열을 만든다.
// 3. 배열의 url의 home 주소를 정한다. (세번째 '/' 이전까지는 home)
// 4. 이후 '/'의 개수로 각 home 아래 카테고리 아래 ...

input.addEventListener("change", async function () {
  let file = null;
  let txt = null;
  file = this.files[0];
  txt = await file.text();
  let p = document.createElement("p");
  
  //console.log(output.childElementCount)
  //output.removeChild(p)
  console.log(p)

  let alist = txt.split("\n");
  
  //정규식으로 배열 생성. => 사이트맵 obj 생성
  for (const [idx, elem] of alist.entries()) {
    let chopped_by_slash_list = reg(elem); //[//['www.teeclub.co.kr', 'shop', 'main', 'index_bantee.php\r']]
    //max_depth 구하기.
    max_depth =
      max_depth < chopped_by_slash_list.length
        ? chopped_by_slash_list.length
        : max_depth;
    if (toggle == 1) {
      for (let i = 0; i < chopped_by_slash_list.length; i++) {
        window["_window" + i] = [];
      }
      //p.removeAttribute("textContent")
      toggle = 0;
    }
    list_to_eachlayer(chopped_by_slash_list);
  }

  //Test
  for (i = 0; i < max_depth; i++) {
    if (document.getElementById(`_elem_layer_${i}`)) {
      document.getElementById(`_elem_layer_${i}`).remove();
    }
    window["_elem_layer_" + i] = document.createElement("div"); //각 레이어층 elem
    window["_elem_layer_" + i].className = `layer`; // id 속성 설정
    window["_elem_layer_" + i].id = `_elem_layer_${i}`; // id 속성 설정

    layer_container.appendChild(window["_elem_layer_" + i]);

    for (a of window["_window" + i]) {
      let targetLayer = document.getElementById(`_elem_layer_${i}`);
      if (targetLayer != null) {
        //null check
        console.log("있음.");

        let node = document.createElement("div");
        node.id = a._name;
        node.className = "node";

        const blank_pattern = /^\s+|\s+$/g;
        if (a._name.replace(blank_pattern, "")) {
          //공백검사.
          let name = document.createTextNode(a._name);
          node.appendChild(name);
          targetLayer.appendChild(node);

          let elem = document.getElementById(node.id);
          let rect = elem.getBoundingClientRect();
        //   console.log(`rect.x : ${rect.x}`);
        //   console.log(`rect.y : ${rect.y}`);
        }
      }
      sitemap.push(a);
    }
  }
  toggle = 1;
//   if(toggle==1){
//     //p.remove()
//     output.removeChild(p)
//     p = document.createElement("p");
//   }
  console.log(`sitemap : ${sitemap}`);
  console.log(`max_depth : ${max_depth}`);

  let root = list_to_tree(sitemap);
  console.log(`root : ${root}`);
  
  p.textContent = JSON.stringify(root, null, 2);
  output.appendChild(p);
  console.log("stringified_root: " + JSON.stringify(root, null, 2));
});

//불러온 alist 항목들을 / 에 맞춰서 정규표현식으로 나누기.
function reg(elem) {
  //2번째 인덱스가 home
  //['https:',"","www.aaaa.co.kr","shop","goods",...]
  chopped_by_slash_list = elem.split(/[/]/);
  chopped_by_slash_list.splice(0, 2);

  return chopped_by_slash_list;
}

function list_to_eachlayer(chopped_by_slash_list) {
  for (let i = 0; i < chopped_by_slash_list.length; i++) {
    //초기화
    if (!window["_window" + i]) {
      window["_window" + i] = [];
    }
    //전처리
    if (chopped_by_slash_list[i].includes("?")) {
      //쿼리가 있는경우
      chopped_by_slash_list[i] = chopped_by_slash_list[i].split("?")[0]; // 쿼리 앞부분만
    }
    if (chopped_by_slash_list[i].includes("#")) {
      //#플래그가 있는경우
      chopped_by_slash_list[i] = chopped_by_slash_list[i].split("#")[0]; // 쿼리 앞부분만
    }

    // 0 ~ N
    if (i == 0) {
      //home 일경우

      if (
        !(
          window["_window" + i].filter(
            (e) => e._name === chopped_by_slash_list[i]
          ).length > 0
        )
      ) {
        //중복 검사.
        window["_window" + i].push({
          _name: chopped_by_slash_list[i],
          _parent: undefined,
          _children: null,
          _level: i,
        });
      }
    } else {
      // 나머지
      if (
        !(
          window["_window" + i].filter(
            (e) => e._name === chopped_by_slash_list[i]
          ).length > 0
        )
      ) {
        //중복 검사.
        window["_window" + i].push({
          _name: chopped_by_slash_list[i],
          _parent: chopped_by_slash_list[i - 1],
          _children: null,
          _level: i,
        });
      }
    }
  }
}

//사이트맵.
function list_to_tree(list) {
  var map = {},
    node,
    roots = [],
    i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i]._name] = i; // initialize the map
    list[i]._children = []; // initialize the _children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node._parent !== undefined) {
      // if you have dangling branches check that map[node._parent] exists
      list[map[node._parent]]._children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}
