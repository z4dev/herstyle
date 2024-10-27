'use client'
function error() {
  return (
    <div className="h-screen flex flex-col items-center  justify-center text-center">
      <h1 className="text-3xl">خطأ</h1> 
      <p className="text-xl">حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقًا.</p> 
      <p className="text-xl">إذا استمرت المشكلة، يرجى الاتصال بالدعم.</p> 
    </div>
  )
}

export default error
