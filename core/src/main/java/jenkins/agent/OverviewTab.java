package jenkins.agent;

import hudson.model.Actionable;
import jenkins.model.Tab;

public class OverviewTab extends Tab {

    public OverviewTab(Actionable object) {
        super(object);
    }

    @Override
    public String getDisplayName() {
        return "Overview";
    }
    @Override
    public String getIconFileName() {
        return "symbol-overview";
    }

    public String getUrlName() {
        return null;
    }

}
