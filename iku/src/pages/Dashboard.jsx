import React from "react";
import BaseLayout from "../components/BaseLayout";
import ImgWithText from "../components/custom/ImgWithText";
import DashboardCard from "../components/DashboardCard";

export default function Dashboard() {
  return (
    <>
      <BaseLayout>
      <div class="w-full flex flex-col items-center">
        <div class="w-full max-w-screen-xl flex flex-col justify-center">
          <ImgWithText url="/src/assets/stm_bus.jpg">
            Dashboard
          </ImgWithText>
          <div class="grow flex">
            <DashboardCard></DashboardCard>
          </div>
        </div>
      </div>
      
      </BaseLayout>
      
        
    </>
  );
}
