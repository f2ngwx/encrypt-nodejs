var crypto = require('crypto');
var fs = require('fs');

var args = process.argv.slice(2);

if(args.length<=0){
    console.error('请输入正确的参数==1');
    process.exit(1);
}

var password = null;//加密 密码
var algorithm = null;//'AES-128-CBC' 加密
// var path = process.argv[1];//项目路径
var root_path = null; //'.' 需要加密的项目路径
var excludes = ['.git','.vscode', 'test', 'doc', 'node_modules', 'config', 'dataConfig','public','views','build'];//排除的文件夹名称

for (var m = 0; m < args.length; m++) {
    if(args[m].indexOf('--A')===0){
        algorithm = args[m].slice(3)
    }
    if(args[m].indexOf('--P')===0){
        password = args[m].slice(3)
    }
    if(args[m].indexOf('--D')===0){
        root_path = args[m].slice(3)
    }
}

if(!algorithm || !password || !root_path){
    console.error('请输入正确的参数==2');
    process.exit(1);
}


//加密
var encrypt = function (content) {
    if (!content) return content;
    var encrypted = "";
    var cip = crypto.createCipher(algorithm, password);
    encrypted += cip.update(content, 'utf8', 'hex');
    encrypted += cip.final('hex');
    return '__maiduo__encrypt__' + encrypted
};
//解密
// function decrypt(content) {
//     if (!content || content.indexOf("__maiduo__encrypt__") !== 0) return content;
//     content = content.replace('__maiduo__encrypt__', '');
//     // var crypto = NativeModule.require('Crypto');
//     var decrypted = '';
//     var decipher = crypto.createDecipher('AES-128-CBC', password);
//     decrypted += decipher.update(content, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// }

function contain(fields, f) {
    var isCon = false;
    for (var m = 0; m < fields.length; m++) {
        // console.log(fields[m] , f,fields[m] == f)
        if (fields[m] == f){
            isCon = true;
            break;
        }
    }
    return isCon;
}

function handler(path) {
    var info = fs.statSync(path);
    if (info.isDirectory()) {
        console.log('进入路径--->>>>:',path)
        fs.readdirSync(path).forEach(function (filename) {
            var p = path + '/' + filename;
            var f = fs.statSync(p);
            console.log('当前:'+filename+' 是否为文件:',f.isFile());
            if (/\.js$/.test(filename) && f.isFile()) {//加密文件
                console.log('开始加密文件:',p);
                var content = fs.readFileSync(p, { encoding: 'utf8' });
                content = encrypt(content);//加密后的内容
                console.log('写入加密内容:',p);
                fs.writeFileSync(p, content, {
                    encoding: 'utf8'
                });
            }
            if (f.isDirectory() && !contain(excludes, filename)) {
                // console.log('当前文件夹为:',filename,'是否包含:',contain(excludes, filename))
                handler(p);
            }
        });
    }
}

handler(root_path);
