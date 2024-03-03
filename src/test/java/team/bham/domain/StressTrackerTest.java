package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class StressTrackerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StressTracker.class);
        StressTracker stressTracker1 = new StressTracker();
        stressTracker1.setId(1L);
        StressTracker stressTracker2 = new StressTracker();
        stressTracker2.setId(stressTracker1.getId());
        assertThat(stressTracker1).isEqualTo(stressTracker2);
        stressTracker2.setId(2L);
        assertThat(stressTracker1).isNotEqualTo(stressTracker2);
        stressTracker1.setId(null);
        assertThat(stressTracker1).isNotEqualTo(stressTracker2);
    }
}
