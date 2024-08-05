import React, { useEffect, useState } from "react";
import { CitizenInfoLabel, Loader, Dropdown, FormStep, CardLabel, RadioOrSelect } from "@upyog/digit-ui-react-components";
import Timeline from "../components/TLTimelineInFSM";
import { useLocation } from "react-router-dom";

const SelectPropertyType = ({ config, onSelect, t, userType, formData }) => {
  const { pathname: url } = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const select = (items) => items.map((item) => ({ ...item, i18nKey: t(item.i18nKey) }));

  const propertyTypesData = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PropertyType", { select });

  //const usageType=formData?.cpt!=="undefined"? (formData?.cpt?.details?.usageCategory==="RESIDENTIAL" ? formData?.cpt?.details?.usageCategory: formData?.cpt?.details?.usageCategory.split('.')[1]):""
  //const property = JSON.parse(sessionStorage?.getItem("Digit_FSM_PT")|| "{}")
  let property = sessionStorage?.getItem("Digit_FSM_PT")
if (property !== "undefined")
{
  property = JSON.parse(sessionStorage?.getItem("Digit_FSM_PT"))
}
  const usageType = property?.propertyDetails?.usageCategory || property?.usageCategory
  const [propertyType, setPropertyType] = useState();
useEffect(()=>{
 if(userType === "employee" && property && propertyTypesData.data)
    {
      
      let propertyType = []
      
      propertyType = propertyTypesData?.data.filter((city) => {
          return city.code == usageType
        })
        console.log("SSSSSS",propertyType)
        if(propertyType.length >0)
        {
          onSelect(config.key, propertyType[0].code)
        }
     
    }
},[])
  useEffect(() => {
    if(property){
      setPropertyType(usageType)
    }
    
    if (!propertyTypesData.isLoading && propertyTypesData.data) {
      const preFilledPropertyType = propertyTypesData.data.filter(
        (propertyType) => propertyType.code === (usageType||formData?.propertyType?.code || formData?.propertyType)
      )[0];
      setPropertyType(preFilledPropertyType);
    }
  }, [property, formData?.propertyType, propertyTypesData.data]);

  const goNext = () => {
    sessionStorage.removeItem("Digit.total_amount");
    onSelect(config.key, propertyType);
  };
  function selectedValue(value) {
    setPropertyType(value);
  }
  function selectedType(value) {
    onSelect(config.key, value.code);
  }

  const getInfoContent = () => {
    let content = t("CS_DEFAULT_INFO_TEXT");
    if (formData && formData.selectPaymentPreference && formData.selectPaymentPreference.code === "PRE_PAY") {
      content = t("CS_CHECK_INFO_PAY_NOW");
    } else {
      content = t("CS_CHECK_INFO_PAY_LATER");
    }
    return content;
  };

  if (propertyTypesData.isLoading) {
    return <Loader />;
  }
  if (userType === "employee") {
    return (
      <Dropdown
        option={propertyTypesData.data?.sort((a, b) => a.name.localeCompare(b.name))}
        optionKey="i18nKey"
        id="propertyType"
        selected={propertyType}
        select={selectedType}
        t={t}
        disable={url.includes("/modify-application/") || url.includes("/new-application") ? false : true}
      />
    );
  } else {
    return (
      <React.Fragment>
        <Timeline currentStep={1} flow="APPLY" />
        <FormStep config={config} onSelect={goNext} isDisabled={!propertyType} t={t}>
          <CardLabel>{`${t("CS_FILE_APPLICATION_PROPERTY_LABEL")} *`}</CardLabel>
          <RadioOrSelect
            options={propertyTypesData.data?.sort((a, b) => a.name.localeCompare(b.name))}
            selectedOption={propertyType}
            optionKey="i18nKey"
            onSelect={selectedValue}
            t={t}
          />
        </FormStep>
        {propertyType && (
          <CitizenInfoLabel
            info={t("CS_FILE_APPLICATION_INFO_LABEL")}
            text={t("CS_FILE_APPLICATION_INFO_TEXT", { content: t("CS_DEFAULT_INFO_TEXT"), ...propertyType })}
          />
        )}
      </React.Fragment>
    );
  }
};

export default SelectPropertyType;

