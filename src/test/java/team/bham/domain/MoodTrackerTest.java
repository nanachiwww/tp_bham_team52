package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class MoodTrackerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MoodTracker.class);
        MoodTracker moodTracker1 = new MoodTracker();
        moodTracker1.setId(1L);
        MoodTracker moodTracker2 = new MoodTracker();
        moodTracker2.setId(moodTracker1.getId());
        assertThat(moodTracker1).isEqualTo(moodTracker2);
        moodTracker2.setId(2L);
        assertThat(moodTracker1).isNotEqualTo(moodTracker2);
        moodTracker1.setId(null);
        assertThat(moodTracker1).isNotEqualTo(moodTracker2);
    }
}
