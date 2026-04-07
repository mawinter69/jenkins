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
import jenkins.model.menu.Semantic;

@Extension
public class DisconnectAgentAction extends TransientActionFactory<SlaveComputer> {

    @Override
    public Class<SlaveComputer> type() {
        return SlaveComputer.class;
    }

    @NonNull
    @Override
    public Collection<? extends Action> createFor(@NonNull SlaveComputer target) {
        if (!target.hasPermission(Computer.DISCONNECT)) {
            return Set.of();
        }

        return Set.of(new Action() {
            @Override
            public String getDisplayName() {
                return Messages.DisconnectAgentAction_Title();
            }

            @Override
            public String getIconFileName() {
                return "symbol-disconnect";
            }

            @Override
            public Group getGroup() {
                return Group.FIRST_IN_MENU;
            }

            @Override
            public String getUrlName() {
                return "disconnect";
            }

            /*
             * TODO: use DialogEvent once available
            @Override
            public Event getEvent() {
                return ConfirmationEvent.of(Messages.DeleteAgentFactory_DeleteDialog_Title(), Messages.DeleteAgentFactory_DeleteDialog_Description(),  "doDelete");
            }
            */
            @Override
            public Semantic getSemantic() {
                return Semantic.DESTRUCTIVE;
            }
        });
    }
}
