/* eslint-disable */
import React from "react";
// import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
// import { MenuItem } from "design-system-old";
// import {
//   ADMIN_SETTINGS,
//   APPSMITH_DISPLAY_VERSION,
//   createMessage,
//   DOCUMENTATION,
//   WELCOME_TOUR,
// } from "@appsmith/constants/messages";
// import { getIsFetchingApplications } from "@appsmith/selectors/applicationSelectors";
// import { getOnboardingWorkspaces } from "selectors/onboardingSelectors";
// import { getAppsmithConfigs } from "@appsmith/configs";
// import AnalyticsUtil from "utils/AnalyticsUtil";
// import { howMuchTimeBeforeText } from "utils/helpers";
// import { onboardingCreateApplication } from "actions/onboardingActions";
import ProductUpdatesModal from "pages/Applications/ProductUpdatesModal";
import { Colors } from "constants/Colors";
// import {
//   DropdownOnSelectActions,
//   getOnSelectAction,
// } from "pages/common/CustomizedDropdown/dropdownHelpers";
// import { getCurrentUser } from "selectors/usersSelectors";
// import {
//   getDefaultAdminSettingsPath,
//   showAdminSettings,
// } from "@appsmith/utils/adminSettingsHelpers";
// import { getTenantPermissions } from "@appsmith/selectors/tenantSelectors";

import { ReactComponent as AppsmithLogo } from "assets/svg/appsmith_logo_primary.svg";
import { BASE_URL } from "constants/routes";
import log from "loglevel";
import axios from "axios";

export const Wrapper = styled.div`
  padding-bottom: ${(props) => props.theme.spaces[3]}px;
  background-color: ${Colors.WHITE};
  width: 100%;
  margin-top: auto;

  & .ads-dialog-trigger {
    margin-top: ${(props) => props.theme.spaces[1]}px;
  }

  & .ads-dialog-trigger > div {
    position: initial;
    width: 92%;
    padding: ${(props) =>
      `${props.theme.spaces[0]}px ${props.theme.spaces[6]}px`};
  }
`;

export const LeftPaneVersionData = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${Colors.MIRAGE_2};
  font-size: 8px;
  width: 92%;
  margin-top: ${(props) => props.theme.spaces[3]}px;
`;

function LeftPaneBottomSection() {
  // const dispatch = useDispatch();
  // const onboardingWorkspaces = useSelector(getOnboardingWorkspaces);
  // const isFetchingApplications = useSelector(getIsFetchingApplications);
  // const { appVersion } = getAppsmithConfigs();
  // const howMuchTimeBefore = howMuchTimeBeforeText(appVersion.releaseDate);
  // const user = useSelector(getCurrentUser);
  // const tenantPermissions = useSelector(getTenantPermissions);
  const [version, setVersion] = React.useState("");
  React.useEffect(() => {
    axios
      .get(BASE_URL + "/static/version.txt")
      .then((res) => {
        setVersion("" + res.data);
      })
      .catch((e) => log.error("Error in getting version number", e));
  }, []);
  return (
    <Wrapper>
      {/* {showAdminSettings(user) && !isFetchingApplications && (
        <MenuItem
          className="admin-settings-menu-option"
          icon="setting"
          onSelect={() => {
            getOnSelectAction(DropdownOnSelectActions.REDIRECT, {
              path: getDefaultAdminSettingsPath({
                isSuperUser: user?.isSuperUser,
                tenantPermissions,
              }),
            });
          }}
          text={createMessage(ADMIN_SETTINGS)}
        />
      )}
      <MenuItem
        icon="discord"
        onSelect={() => {
          window.open("https://discord.gg/rBTTVJp", "_blank");
        }}
        text={"Join our Discord"}
      />
      <MenuItem
        icon="book"
        onSelect={() => {
          window.open("https://docs.appsmith.com/", "_blank");
        }}
        text={createMessage(DOCUMENTATION)}
      />

      <MenuItem
        containerClassName={"t--welcome-tour"}
        icon="guide"
        onSelect={() => {
          if (!isFetchingApplications && !!onboardingWorkspaces.length) {
            AnalyticsUtil.logEvent("WELCOME_TOUR_CLICK");
            dispatch(onboardingCreateApplication());
          }
        }}
        text={createMessage(WELCOME_TOUR)}
      /> */}

      <ProductUpdatesModal />
      <LeftPaneVersionData>
        {/* <span>
          {createMessage(
            APPSMITH_DISPLAY_VERSION,
            appVersion.edition,
            appVersion.id,
            cloudHosting,
          )}
        </span>
        {howMuchTimeBefore !== "" && (
          <span>Released {howMuchTimeBefore} ago</span>
        )} */}
        <span>
          Powered By{" "}
          <AppsmithLogo
            style={{
              width: "65px",
              marginTop: "-15px",
              marginLeft: "45px",
            }}
          />
        </span>
        <span>Formbuilder v{version}</span>
      </LeftPaneVersionData>
    </Wrapper>
  );
}

export default LeftPaneBottomSection;
