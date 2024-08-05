import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header, Card, KeyNote, LinkButton, Loader, MultiLink } from "@upyog/digit-ui-react-components";
import { useHistory, useLocation, useParams } from "react-router-dom";
import getPDFData from "../../getPDFData";
import { getVehicleType } from "../../utils";
import { ApplicationTimeline } from "../../components/ApplicationTimeline";

const ApplicationDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const { state: locState } = useLocation();
  const tenantId = locState?.tenantId || Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  const [viewTimeline, setViewTimeline]=useState(false);

  const { isLoading, isError, error, data: application, error: errorApplication } = Digit.Hooks.fsm.useApplicationDetail(
    t,
    tenantId,
    id,
    {},
    "CITIZEN"
  );

  const { data: paymentsHistory } = Digit.Hooks.fsm.usePaymentHistory(tenantId, id);
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};
  const [showOptions, setShowOptions] = useState(false);

  if (isLoading || !application) {
    return <Loader />;
  }

  if (application?.applicationDetails?.length === 0) {
    history.goBack();
  }

  const handleDownloadPdf = async () => {
    const tenantInfo = tenants.find((tenant) => tenant.code === application?.tenantId);
    const data = getPDFData({ ...application?.pdfData }, tenantInfo, t);
    Digit.Utils.pdf.generate(data);
    setShowOptions(false);
  };

  const downloadPaymentReceipt = async () => {
    const receiptFile = { filestoreIds: [paymentsHistory.Payments[0]?.fileStoreId] };

    if (!receiptFile?.filestoreIds?.[0]) {
      const newResponse = await Digit.PaymentService.generatePdf(state, { Payments: [paymentsHistory.Payments[0]] }, "fsm-receipt");
      const fileStore = await Digit.PaymentService.printReciept(state, { fileStoreIds: newResponse.filestoreIds[0] });
      window.open(fileStore[newResponse.filestoreIds[0]], "_blank");
      setShowOptions(false);
    } else {
      const fileStore = await Digit.PaymentService.printReciept(state, { fileStoreIds: receiptFile.filestoreIds[0] });
      window.open(fileStore[receiptFile.filestoreIds[0]], "_blank");
      setShowOptions(false);
    }
  };
  const handleViewTimeline=()=>{ 
    const timelineSection=document.getElementById('timeline');
      if(timelineSection){
        timelineSection.scrollIntoView({behavior: 'smooth'});
      } 
      setViewTimeline(true);   
  };

  const dowloadOptions =
    paymentsHistory?.Payments?.length > 0
      ? [
          {
            label: t("CS_COMMON_APPLICATION_ACKNOWLEDGEMENT"),
            onClick: handleDownloadPdf,
          },
          {
            label: t("CS_COMMON_PAYMENT_RECEIPT"),
            onClick: downloadPaymentReceipt,
          },
        ]
      : [
          {
            label: t("CS_COMMON_APPLICATION_ACKNOWLEDGEMENT"),
            onClick: handleDownloadPdf,
          },
        ];

  return (
    <React.Fragment>
      <div style={{display:"flex",justifyContent:"space-between",maxWidth:"960px"}} className="cardHeaderWithOptions">
        <Header>{t("CS_FSM_APPLICATION_DETAIL_TITLE_APPLICATION_DETAILS")}</Header>
        <div >
        {/* <MultiLink
          className="multilinkWrapper"
          onHeadClick={() => setShowOptions(!showOptions)}
          displayOptions={showOptions}
          options={dowloadOptions}
        /> */}
        <LinkButton label={t("VIEW_TIMELINE")} style={{ color:"#A52A2A"}} onClick={handleViewTimeline}></LinkButton>
        </div>
        
      </div>
      <Card style={{ position: "relative" }}>
        {application?.applicationDetails?.map(({ title, value, child, caption, map }, index) => {
          return (
            <KeyNote key={index} keyValue={t(title)} note={t(value) || ((!map || !child) && "N/A")} caption={t(caption)}>
              {child && typeof child === "object" ? React.createElement(child.element, { ...child }) : child}
            </KeyNote>
          );
        })}
          <div id="timeline">
            <ApplicationTimeline application={application?.pdfData} id={id} />
          </div>       
      </Card>
    </React.Fragment>
  );
};

export default ApplicationDetails;
