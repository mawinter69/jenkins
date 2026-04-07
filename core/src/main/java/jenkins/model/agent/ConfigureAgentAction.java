package jenkins.model.agent;

import edu.umd.cs.findbugs.annotations.NonNull;
import hudson.Extension;
import hudson.model.Action;
import hudson.model.Computer;
import java.util.Collection;
import java.util.Set;
import jenkins.model.TransientActionFactory;
import jenkins.model.menu.Group;

@Extension
public class ConfigureAgentAction extends TransientActionFactory<Computer> {

    @Override
    public Class<Computer> type() {
        return Computer.class;
    }

    @NonNull
    @Override
    public Collection<? extends Action> createFor(@NonNull Computer target) {
        if (!target.hasPermission(Computer.EXTENDED_READ)) {
            return Set.of();
        }

        return Set.of(new Action() {
            @Override
            public String getIconFileName() {
                return "symbol-settings";
            }

            @Override
            public String getDisplayName() {
                return target.hasPermission(Computer.CONFIGURE) ? Messages.ConfigureAgentAction_Title() : Messages.ConfigureAgentAction_ViewConfiguration();
            }

            @Override
            public String getUrlName() {
                return "configure";
            }

            @Override
            public Group getGroup() {
                return Group.IN_APP_BAR;
            }
        });
    }

}
