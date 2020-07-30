var aInfo = {};
var dInfo = {};

function init(){
    initSDKCallback();
    player.getDeviceInfo( 'getDeviceInfoCallback' );
    // player.getToken( 'getTokenCallback' );
    Home.init()
}

function initSDKCallback () {
    window.getDeviceInfoCallback = getDeviceInfoCallback;
    window.getAccountInfoCallback = getAccountInfoCallback;
    window.getTokenCallback = getTokenCallback;
}

function getDeviceInfoCallback ( res ) {
    console.log( '设备信息:' + JSON.stringify( res ) );
    if ( !res ) {
        return console.log( '设备信息未获取到' );
    }
    dInfo = res;
    player.getAccountInfo( 'getAccountInfoCallback' );
    Cookies.set("dInfo", JSON.stringify( res ), { path: '/' });
}

function getAccountInfoCallback ( res ) {
    console.log( '用户信息:' + JSON.stringify( res ) );
    if ( !res ) {
        return console.log( '用户信息未获取到' );
    }
    aInfo = res;
    bi.init({
        model: dInfo.model,
        soft_v: dInfo.softVName,
        user_id: aInfo.user_id,
        device_id: dInfo.eth0_mac
    });
    Cookies.set("aInfo", JSON.stringify( res ), { path: '/' });
}

function getTokenCallback( res ) {
    console.log( '获取到的token:' + JSON.stringify( res ) );
    if ( !res ) {
        return console.log( 'token未获取到' );
    }
    Cookies.set("t", JSON.stringify( res ), { path: '/' });
}