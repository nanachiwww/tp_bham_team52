package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class CustomGoalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CustomGoal.class);
        CustomGoal customGoal1 = new CustomGoal();
        customGoal1.setId(1L);
        CustomGoal customGoal2 = new CustomGoal();
        customGoal2.setId(customGoal1.getId());
        assertThat(customGoal1).isEqualTo(customGoal2);
        customGoal2.setId(2L);
        assertThat(customGoal1).isNotEqualTo(customGoal2);
        customGoal1.setId(null);
        assertThat(customGoal1).isNotEqualTo(customGoal2);
    }
}
