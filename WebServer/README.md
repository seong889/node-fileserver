# WebServer
Typescript로 일부 작성되어 visual studio + node.js extention을 활용하여 컴파일을 하는것을 권장합니다.

## installation
```shell
npm install
npm "install" "bcrypt@https://github.com/ksmyth/node.bcrypt.js/tarball/v0.8.5" -s
```

## setting
`lib/common.js`의 변수값을 수정하여 환경 설정

```javascript
module.exports.base_path #root directory path
module.exports.password #password
```


## run
```shell
node bin/www
```shell