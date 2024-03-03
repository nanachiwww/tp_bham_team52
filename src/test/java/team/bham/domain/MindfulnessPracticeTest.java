package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class MindfulnessPracticeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MindfulnessPractice.class);
        MindfulnessPractice mindfulnessPractice1 = new MindfulnessPractice();
        mindfulnessPractice1.setId(1L);
        MindfulnessPractice mindfulnessPractice2 = new MindfulnessPractice();
        mindfulnessPractice2.setId(mindfulnessPractice1.getId());
        assertThat(mindfulnessPractice1).isEqualTo(mindfulnessPractice2);
        mindfulnessPractice2.setId(2L);
        assertThat(mindfulnessPractice1).isNotEqualTo(mindfulnessPractice2);
        mindfulnessPractice1.setId(null);
        assertThat(mindfulnessPractice1).isNotEqualTo(mindfulnessPractice2);
    }
}
