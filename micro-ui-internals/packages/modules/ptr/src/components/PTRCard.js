import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard, PTRIcon } from "@upyog/digit-ui-react-components";

const PTRCard = () => {
  const { t } = useTranslation();

  const [total, setTotal] = useState("-");
  const { data, isLoading, isFetching, isSuccess } = Digit.Hooks.useNewInboxGeneral({
    tenantId: Digit.ULBService.getCurrentTenantId(),
    ModuleCode: "PTR",
    filters: { limit: 10, offset: 0, services: ["ptr"] },

    config: {
      select: (data) => {
        return {totalCount:data?.totalCount,nearingSlaCount:data?.nearingSlaCount} || "-";
      },
      enabled: Digit.Utils.ptrAccess(),
    },
  });

  useEffect(() => {
    if (!isFetching && isSuccess) setTotal(data);
  }, [isFetching]);

  if (!Digit.Utils.ptrAccess()) {
    return null;
  }
  const links=[
    {
      count: isLoading ? "-" : total?.totalCount,
      label: t("ES_COMMON_INBOX"),
      link: `/digit-ui/employee/ptr/petservice/inbox`,
    },
    {
      label: t("PTR_TITLE_NEW_PET_REGISTRATION"),
      link: `/digit-ui/employee/ptr/petservice/new-application`,
      role: "PTR_CEMP"
    },
    {
      label: t("ES_COMMON_APPLICATION_SEARCH"),
      link: `/digit-ui/employee/ptr/petservice/my-applications`,
    },
  ]
  const PTR_CEMP = Digit.UserService.hasAccess(["PTR_APPROVER", "PTR_CEMP", "PTR_VERIFIER"]) || false;
  const propsForModuleCard = {
    Icon: <PTRIcon />,
    moduleName: t("PTR_TITLE_PET_REGISTRATION"),
    kpis: [
      {
        count: total?.totalCount,
        label: t("ES_TITLE_INBOX"),
        link: `/digit-ui/employee/ptr/petservice/inbox`,
      },
    ],
    links:links.filter(link=>!link?.role||PTR_CEMP),
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default PTRCard;
