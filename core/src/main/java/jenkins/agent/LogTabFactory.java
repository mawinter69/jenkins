package jenkins.agent;

import edu.umd.cs.findbugs.annotations.NonNull;
import hudson.Extension;
import hudson.model.Computer;
import hudson.slaves.SlaveComputer;
import java.util.Collection;
import java.util.Collections;
import jenkins.model.Tab;
import jenkins.model.TransientActionFactory;
import jenkins.model.experimentalflags.NewAgentPageUserExperimentalFlag;

@Extension(ordinal = Integer.MAX_VALUE - 1)
public class LogTabFactory extends TransientActionFactory<SlaveComputer> {

    @Override
    public Class<SlaveComputer> type() {
        return SlaveComputer.class;
    }

    @NonNull
    @Override
    public Collection<? extends Tab> createFor(@NonNull SlaveComputer computer) {
        if (!computer.hasAnyPermission(Computer.EXTENDED_READ, Computer.CONNECT)) {
            return Collections.emptyList();
        }

        boolean isExperimentalUiEnabled = new NewAgentPageUserExperimentalFlag().getFlagValue();

        if (!isExperimentalUiEnabled) {
            return Collections.emptyList();
        }

        return Collections.singleton(new LogTab(computer));
    }
}
