package jenkins.agent;

import edu.umd.cs.findbugs.annotations.NonNull;
import hudson.Extension;
import hudson.model.Computer;
import java.util.Collection;
import java.util.Collections;
import jenkins.model.Tab;
import jenkins.model.TransientActionFactory;
import jenkins.model.experimentalflags.NewAgentPageUserExperimentalFlag;

@Extension(ordinal = Integer.MAX_VALUE)
public class OverviewTabFactory extends TransientActionFactory<Computer> {

    @Override
    public Class<Computer> type() {
        return Computer.class;
    }

    @NonNull
    @Override
    public Collection<? extends Tab> createFor(@NonNull Computer computer) {
        boolean isExperimentalUiEnabled = new NewAgentPageUserExperimentalFlag().getFlagValue();

        if (!isExperimentalUiEnabled) {
            return Collections.emptyList();
        }

        return Collections.singleton(new OverviewTab(computer));
    }
}
