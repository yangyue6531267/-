var template = {};

// 模板内字符串拼接
template.template = function (list) {
  this.data = list;
  this.direction = "";
}
// 模板id
template.id = 0;

// 模板名称
template.name = 'template'

// 模板数据
template.data = {};

template.itemNo = 0;

template.pos = 0;


template.top = function (params) {

}

template.down = function (params) {

}

template.left = function (params) {

}

template.right = function (params) {

}


template.init = function () {

}
// 键值监听
template.getKeyValue = function (kc) {
  
  if (kc === 'right') {

  } else if (kc === 'left') {

  } else if (kc === 'up') {

  } else if (kc === 'down') {

  } else if (kc === 'ok') {

  } else if (kc === 'back') {

  }
}