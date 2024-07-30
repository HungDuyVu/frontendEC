import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>

      {/* <HorizontalCardProduct category={"Tai nghe"} heading={"Top's Airpodes"}/>
      <HorizontalCardProduct category={"watches"} heading={"Popular's Watches"}/> */}

      <VerticalCardProduct category={"Tai nghe"} heading={"Top's Airpodes"}/>
      <VerticalCardProduct category={"Đồng hồ"} heading={"Popular's Watches"}/>

      <VerticalCardProduct category={"Điện thoại"} heading={"Điện thoại"}/>
      <VerticalCardProduct category={"Chuột"} heading={"Chuột"}/>
      <VerticalCardProduct category={"Ti vi"} heading={"Tivi"}/>
      <VerticalCardProduct category={"camera"} heading={"Máy ảnh & Nhiếp ảnh"}/>
      <VerticalCardProduct category={"earphones"} heading={"Tai nghe có dây"}/>
      <VerticalCardProduct category={"speakers"} heading={"Loa Bluetooth"}/>
      <VerticalCardProduct category={"refrigerator"} heading={"Tủ lạnh"}/>
      <VerticalCardProduct category={"trimmers"} heading={"Máy tỉa lông"}/>

    </div>
  )
}

export default Home