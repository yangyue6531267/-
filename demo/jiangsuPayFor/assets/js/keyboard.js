var orderList = [] //所有套餐价格
var childrenList = [] //线上套餐价格
var baseUrl = 'http://47.97.96.103:80/'

$(function() {
    //获取产品信息
    prompt('yanhua://epg/getProducts?return=getDate');
})

function keyEvent(e) {
    var timer = null
    e = event || window.event || arguments.callee.caller.arguments[0]
    var keycode = e.which || e.keyCode
    clearTimeout(timer)
    timer = setTimeout(function() {
        if (handleKeyCode(keycode)) {
            e.preventDefault()
        }
    }, 100)
}

function handleKeyCode(kc) {
    kc = parseInt(kc)
    if (kc === 39 || kc === 5) {
        KeyRight()
        return true
    } else if (kc === 37 || kc === 3) {
        KeyLeft()
        return true
    } else if (kc === 13) {
        KeyEnter()
        return true
    } else if (kc === 48) {
        num0()
        return true
    } else if (kc === 38 || kc === 1) {
        KeyUp()
        return true
    } else if (kc === 40 || kc === 2) {
        KeyDown()
        return true
    } else if (kc === 8 || kc === 22 || kc === 340 || kc === 27 || kc === 461) {
        KeyBack()
        return true
    } else if (kc === 513 || kc === 832 || kc === 835) {
        gotoIndex()
        return true
    } else if (kc === 125 || kc === 415) {
        return true
    } else if (kc === 127 || kc === 19) {
        return true
    }
    return false
}

function KeyRight() {}

function KeyLeft() {}

function KeyEnter() {
    console.log('click==========订购');
    prompt('yanhua://epg/orderProduct?productId=' + childrenList[0].productId + '&fee=' + orderList[0].fee + '')
    // 防止多次点击
    // document.onkeydown = null
}

function KeyUp() {}

function num0() {
    //退订 线上无此功能，调试临时使用
    // cancel()
}

function KeyDown() {}

function KeyBack() {
    console.log('KeyBack')
    clone()
}

function getDate(obj) {
    console.log('获取产品信息List-----------getProducts');
    console.log(JSON.stringify(obj))
    document.onkeydown = keyEvent
    orderList = obj.data
    // 渲染页面
    for (var i = 0; i < orderList.length; i++) {
        // packageMode 产品模式（0：线上、1：线下）
        if (orderList[i].packageMode == 0) {
            childrenList.push(orderList[i]);
            $('#content').append(
                '<div class="content-msg">' + orderList[i].fee / 100 + '元' + '/' + orderList[i].productCycle + '天' + '</div>' +
                '<div class="connect-item">' +
                '<input type="checkbox" checked="checked" class="checkbox" id="checkboxOneInput">' +
                '立即订购</div>'
            )
        }
    }
}

function clone() {
    prompt('yanhua://epg/exit');
}