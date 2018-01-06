# encrypt-nodejs
nodejs服务端端加密 以及运行时进行解密

通过更改require方法来做到服务器端nodejs代码加密的目的
部署到服务端前 加密
运行的时候require时候进行动态解密
因为nodejs机制是第一次运行后会把本js文件缓存下来
所以一个js文件的解密过程也就发生一次


app.js 为加密工程的代码
未实现代码备份的功能 所以加密前需要备份原工程代码

module.js 是node 0.10.x源码中lib下的module.js
其他版本的node 请参考使用
通过在Module._extensions['.js'] function中增加一个decrypt() 
来实现在require时候解密

decrypt时候会读取/root/.node_key文件中的内容
内容包含加密协议 和 password 中间以 [**] 分割 

命令行方式：
node app.js --AAES --PXXX --D/home/XXX
--A 加密协议
--P 加密密码
--D 带需要加密的工程目录
