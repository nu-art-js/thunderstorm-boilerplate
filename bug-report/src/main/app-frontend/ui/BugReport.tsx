import * as React from "react";
import {BugReportModule} from "../modules/BugReportModule";
import {
    Dialog_Builder,
    DialogButton_Cancel,
    DialogButton_Submit,
    DialogModule,
    TS_TextArea,
    TS_Input
} from "@nu-art/thunderstorm/frontend";

type Props = {
    component?: React.ReactNode
}
const style: React.CSSProperties = {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    width: "50px",
    height: "50px",
    bottom: "30px",
    right: "10px",
    backgroundColor: "#5b7bd6",
    color: "white",
    borderRadius: "50%"
};

export class BugReport
    extends React.Component<Props> {

    showAppConfirmationDialogExample = () => {
        const title = "Submit bug report";
        let description: string = "";
        let subject: string = "";

        const onSubmit = (withJira: boolean = false) => {
            BugReportModule.sendBugReport(subject, description, withJira);
            DialogModule.close();
        };

        const content =
            <div className={'ll_v_c'}>
                <TS_Input
                    type={"text"}
                    value={subject}
                    placeholder={"type a subject here"}
                    onChange={(value: string) => {
                        subject = value;
                    }}
                />
                <TS_TextArea
                    style={{height: "110px", margin: "8px", width: "100%", outline: "none"}}
                    value={description}
                    placeholder={"type your description here"}
                    onChange={(value: string) => {
                        description = value;
                    }}/>
            </div>


        new Dialog_Builder(content)
            .setTitle(title)
            .addButton(DialogButton_Cancel(DialogModule.close))
            .addButton(DialogButton_Submit(() => onSubmit(true), 'Jira'))
            .addButton(DialogButton_Submit(() => onSubmit(false), 'No Jira'))
            .setOverlayColor("rgba(102, 255, 255, 0.4)")
            .show();
    };

    render() {
        return (
            <div onClick={this.showAppConfirmationDialogExample}>
                {this.props.component ||
                <button style={style}>+</button>}
            </div>
        );
    }
}