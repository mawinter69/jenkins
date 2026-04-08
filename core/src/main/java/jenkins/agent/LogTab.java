package jenkins.agent;

import hudson.model.Actionable;
import jenkins.model.Tab;

public class LogTab extends Tab {

    public LogTab(Actionable object) {
        super(object);
    }

    @Override
    public String getDisplayName() {
        return "Log";
    }

    @Override
    public String getIconFileName() {
        return "symbol-logs";
    }

    public String getUrlName() {
        return "log";
    }

}
