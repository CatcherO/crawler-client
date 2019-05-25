async function getRecord(day) {
  function getRecordByDay(page){
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "get",
        url: "/index.php/home/view/searchs.html",
        dataType: "json",
        data: { p: page, "start-time": day, "end-time": day },
        async: true,
        success: function (msg) {
            resolve(msg)
        },
        error: function () {
          reject('请求错误')
        }
      })
    
    })
  }
  let code = 1
  let page = 1
  const result = []
  try {
  while(code){
    let msg = await getRecordByDay(page)
    if(msg.code === 1){
      result.push(msg.data)
      page++
    }else {
      code = 0
    }

  }
  return result
}catch(e){console.log(e)}
}
module.exports = getRecord