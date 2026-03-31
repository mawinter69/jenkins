package jenkins.model.agent;

import edu.umd.cs.findbugs.annotations.NonNull;
import hudson.Extension;
import hudson.model.Action;
import hudson.model.Computer;
import java.util.Collection;
import java.util.Set;
import jenkins.model.Jenkins;
import jenkins.model.TransientActionFactory;
import jenkins.model.experimentalflags.NewAgentPageUserExperimentalFlag;
import jenkins.model.menu.Group;

@Extension
public class ScriptConsoleAction extends TransientActionFactory<Computer> {

    @Override
    public Class<Computer> type() {
        return Computer.class;
    }

    @NonNull
    @Override
    public Collection<? extends Action> createFor(@NonNull Computer target) {
        Boolean newAgentPageEnabled = new NewAgentPageUserExperimentalFlag().getFlagValue();

        if (!newAgentPageEnabled || !target.hasPermission(Jenkins.ADMINISTER)) {
            return Set.of();
        }

        return Set.of(new Action() {
            @Override
            public String getIconFileName() {
                return target.getChannel() != null ? "symbol-code-working" : null;
            }

            @Override
            public String getDisplayName() {
                return Messages.ScriptConsoleAction_Title();
            }

            @Override
            public String getUrlName() {
                return "script";
            }

            @Override
            public Group getGroup() {
                return Group.FIRST_IN_MENU;
            }
        });
    }

}
