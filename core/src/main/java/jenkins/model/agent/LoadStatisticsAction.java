package jenkins.model.agent;

import edu.umd.cs.findbugs.annotations.NonNull;
import hudson.Extension;
import hudson.model.Action;
import hudson.model.Computer;
import java.util.Collection;
import java.util.Set;
import jenkins.model.TransientActionFactory;
import jenkins.model.experimentalflags.NewAgentPageUserExperimentalFlag;
import jenkins.model.menu.Group;

@Extension
public class LoadStatisticsAction extends TransientActionFactory<Computer> {

    @Override
    public Class<Computer> type() {
        return Computer.class;
    }

    @NonNull
    @Override
    public Collection<? extends Action> createFor(@NonNull Computer target) {
        Boolean newAgentPageEnabled = new NewAgentPageUserExperimentalFlag().getFlagValue();

        // This condition can be removed when the flag has been removed
        if (!newAgentPageEnabled) {
            return Set.of();
        }

        return Set.of(new Action() {
            @Override
            public String getIconFileName() {
                return "symbol-analytics";
            }

            @Override
            public String getDisplayName() {
                return Messages.LoadStatisticsAction_Title();
            }

            @Override
            public String getUrlName() {
                return "load-statistics";
            }

            @Override
            public Group getGroup() {
                return Group.FIRST_IN_MENU;
            }
        });
    }

}
