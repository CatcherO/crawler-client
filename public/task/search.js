async function _searchAjax(url, searchData) {
  console.log(`查询${searchData.city ? searchData.city : searchData.location}`)

  function searchFour(url, searchData) {
    console.log(url, JSON.stringify(searchData))
    return new Promise((resolve, reject) => {

      $.ajax({
        type: "post",
        url: url,
        dataType: "json",
        async: true,
        data: searchData,
        success: function (msg, status, xhr) {
          if(msg.data === null) {
            console.log(JSON.stringify(msg))
            resolve(false)
            return
          }
          if ( msg.code === 1 && msg.data && msg.data.count !== 0) {
            var len = msg.data.count ? msg.data.count : Object.keys(msg.data).length
            console.log(len)
            resolve(true)

          } else {

            var keyword = searchData.tradedic ? 'tradedic' : 'category'
            if (searchData[keyword] !== '装饰') {
              searchData[keyword] = '装饰'
              resolve(true)
            } else {
              console.log(JSON.stringify(msg))
              resolve(false)
              return
            }
          }
        },
        error: function (e) {
          console.log(e)
          reject(e)
        }
      })
    })
  }
  let code = true
  while (code ) {
    try {
   code = await searchFour(url, searchData)
    } catch (err) {
      console.log(err)
    }
   console.log(code)
  }
}
module.exports = _searchAjax