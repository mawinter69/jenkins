package jenkins.model.agent;

import edu.umd.cs.findbugs.annotations.NonNull;
import hudson.Extension;
import hudson.model.Action;
import hudson.model.Computer;
import hudson.slaves.SlaveComputer;
import java.util.Collection;
import java.util.Set;
import jenkins.model.TransientActionFactory;
import jenkins.model.menu.Group;

@Extension
public class SystemInfoAction extends TransientActionFactory<SlaveComputer> {

    @Override
    public Class<SlaveComputer> type() {
        return SlaveComputer.class;
    }

    @NonNull
    @Override
    public Collection<? extends Action> createFor(@NonNull SlaveComputer target) {
        if (!target.hasAnyPermission(Computer.EXTENDED_READ, Computer.CONNECT)) {
            return Set.of();
        }

        return Set.of(new Action() {
            @Override
            public String getIconFileName() {
                return target.getChannel() != null ? "symbol-information-circle" : null;
            }

            @Override
            public String getDisplayName() {
                return Messages.SystemInfoAction_Title();
            }

            @Override
            public String getUrlName() {
                return "systemInfo";
            }

            @Override
            public Group getGroup() {
                return Group.FIRST_IN_MENU;
            }
        });
    }

}
