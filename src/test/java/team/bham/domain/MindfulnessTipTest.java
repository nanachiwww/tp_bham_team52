package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class MindfulnessTipTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MindfulnessTip.class);
        MindfulnessTip mindfulnessTip1 = new MindfulnessTip();
        mindfulnessTip1.setId(1L);
        MindfulnessTip mindfulnessTip2 = new MindfulnessTip();
        mindfulnessTip2.setId(mindfulnessTip1.getId());
        assertThat(mindfulnessTip1).isEqualTo(mindfulnessTip2);
        mindfulnessTip2.setId(2L);
        assertThat(mindfulnessTip1).isNotEqualTo(mindfulnessTip2);
        mindfulnessTip1.setId(null);
        assertThat(mindfulnessTip1).isNotEqualTo(mindfulnessTip2);
    }
}
