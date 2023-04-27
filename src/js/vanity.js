/* eslint-env worker */
/**
 * 离线生成以太坊地址的步骤如下：
 *1. 生成一个随机的私钥**，通常使用安全的伪随机数生成器（**PRNG**）来生成随机数。
 2. 使用椭圆曲线加密算法（Elliptic Curve Cryptography，ECC）**计算出对应的公钥**。以太坊使用的是 secp256k1 曲线，计算公钥的方法是将私钥作为输入，通过 ECC 算法计算出对应的公钥。
 3. **将公钥进行哈希运算，得到最终的以太坊地址**。以太坊使用的是 Keccak-256 哈希算法，将公钥进行哈希运算得到 256 位的哈希值，**然后取哈希值的后 20 个字节作为地址**。
 */
 const secp256k1 = require('secp256k1');//导入模块
 const keccak = require('keccak');
 const randomBytes = require('randombytes');
 //const fs = require('fs');
 const step = 500;
 
 
 
 /**
  * 将私钥转换为以太坊地址。
  * 
  */
 const privateToAddress = (privateKey) => {
     const pub = secp256k1.publicKeyCreate(privateKey, false).slice(1);//计算公钥的方法是将私钥作为输入，通过 ECC 算法计算出对应的公钥。
     return keccak('keccak256').update(pub).digest().slice(-20).toString('hex');//Keccak-256 哈希算法，将公钥进行哈希运算得到 256 位的哈希值，然后取哈希值的后 20 个字节作为地址。
 };
 
 /**
  * Create a wallet from a random private key
  * 用于生成一个随机私钥，然后将其转换为以太坊地址和私钥字符串
  * @returns {{address: string, privKey: string}}
  */
 const getRandomWallet = () => {
     const randbytes = randomBytes(32);//生成一个 32 字节的随机字节数组
     return {
         address: privateToAddress(randbytes).toString('hex'),
         privKey: randbytes.toString('hex')
     };
 };
 

 /**
  * yang-用于检查地址是否包含前后缀
  * @param {*} address 
  * @param {*} input1 
  * @param {*} input2 
  * @param {*} isChecksum 
  * @returns 
  */
 const isValidVanityAddress2 = (address, input1, input2, isChecksum) => {
 
     const subStr1 = address.substr(0, input1.length);
     const subStr2 = address.substr(40 - input2.length, );
     if (isChecksum) {
         if (input1 === subStr1) {
             return input2 === subStr2;
         }
     }
     else if (input1.toLowerCase() === subStr1.toLowerCase()) {
         return input2.toLowerCase() == subStr2.toLowerCase();
         }
     
     return false;
 };
 /**
  * yang用于检查一个以太坊地址的校验和是否正确
  * @param {*} address 
  * @param {*} input 
  * @param {*} isSuffix 
  * @returns 
  */

 

 /**
  * 用于计算一个以太坊地址的校验和
  * @param {*} address 
  * @returns 
  */
 const toChecksumAddress = (address) => {
     const hash = keccak('keccak256').update(address).digest().toString('hex');
     let ret = '';
     for (let i = 0; i < address.length; i++) {
         ret += parseInt(hash[i], 16) >= 8 ? address[i].toUpperCase() : address[i];
     }
     return ret;
 };
 

 
 /**
  * yang自定义
  * 用于生成以指定字符串为前缀和后缀的以太坊钱包地址。它会生成随机私钥并转换为以太坊地址，然后检查该地址是否符合要求，
  * 如果符合要求则返回该地址和私钥，如果不符合要求则继续生成随机私钥直到找到符合要求的地址。此外，该函数还接受一个回调函数作为参数，
  * 用于在每次生成新地址时调用，以便在后台进行处理
  * @param input - String chosen by the user
  * @param isChecksum - 区分大小写
  * @param isSuffix - Is it a suffix, or a prefix
  * @param cb - Callback called after x attempts, or when an address if found
  * @returns
  */
 const getVanityWallet2 = (input1, len_1, len_2, isChecksum, cb) => {
     input1 = isChecksum ? input1 : input1.toLowerCase();
     const subStr1 = input1.substr(2, len_1);
     const subStr2 = input1.substr(0-len_2);
     let wallet = getRandomWallet();
     let attempts = 1;
 
     while (!isValidVanityAddress2(wallet.address, subStr1, subStr2, isChecksum)) {
         if (attempts >= step) {
             cb({ attempts });
             attempts = 0;
         }
         wallet = getRandomWallet();
         attempts++;
     }
     cb({address: '0x' + toChecksumAddress(wallet.address), privKey: wallet.privKey, attempts});
 };


 onmessage = function (event) {
     const input = event.data;
     
     try {
         let arr = input.add_1.split('\n');
         let _result = new Array();
         arr.forEach((element) => {
             const addr = element.trim();
             getVanityWallet2(addr, input.hex_1, input.hex_2, input.checksum, (message) => {
                //self.postMessage({ address: message });
                
                _result.push(message);
             });
         });
         self.postMessage({ address: _result });

     } catch (err) {
         self.postMessage({ error: err.toString() });
     }};

// onmessage = function (event) {
//     const input = event.data;
  
//     try {
//       let arr = input.add_1.split('\n');
//       let _result = new Array();
//       arr.forEach((element) => {
//         const addr = element.trim();
//         getVanityWallet2(addr, input.hex_1, input.hex_2, input.checksum, (message) => {
//           _result.push(message);
//           // 将结果写入文件
//           const resultStr = `${addr}: ${message}\n`;
//           //writeToLogFile(resultStr);
//           // 发送结果到主线程进行实时显示
//           self.postMessage({ address: resultStr });
//         });
//       });
//       // 等待所有异步操作完成后再将结果发送到主线程
//       Promise.all(_result).then(() => {
//         self.postMessage({ address: _result.join('\n') });
//       });
//     } catch (err) {
//       self.postMessage({ error: err.toString() });
//     }
//   };
module.exports = {
    onmessage
};
 