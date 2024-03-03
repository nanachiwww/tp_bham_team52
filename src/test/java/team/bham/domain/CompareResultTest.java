package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class CompareResultTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CompareResult.class);
        CompareResult compareResult1 = new CompareResult();
        compareResult1.setId(1L);
        CompareResult compareResult2 = new CompareResult();
        compareResult2.setId(compareResult1.getId());
        assertThat(compareResult1).isEqualTo(compareResult2);
        compareResult2.setId(2L);
        assertThat(compareResult1).isNotEqualTo(compareResult2);
        compareResult1.setId(null);
        assertThat(compareResult1).isNotEqualTo(compareResult2);
    }
}
