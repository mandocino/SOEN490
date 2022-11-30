import React from "react";
import BaseLayout from "../components/BaseLayout";
import EditPhoto from "../components/EditPhoto";

export default function Dashboardpage() {
  return (
    <>
      <BaseLayout>
        <EditPhoto />
      </BaseLayout>
    </>
  );
}
