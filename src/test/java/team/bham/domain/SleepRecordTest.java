package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class SleepRecordTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SleepRecord.class);
        SleepRecord sleepRecord1 = new SleepRecord();
        sleepRecord1.setId(1L);
        SleepRecord sleepRecord2 = new SleepRecord();
        sleepRecord2.setId(sleepRecord1.getId());
        assertThat(sleepRecord1).isEqualTo(sleepRecord2);
        sleepRecord2.setId(2L);
        assertThat(sleepRecord1).isNotEqualTo(sleepRecord2);
        sleepRecord1.setId(null);
        assertThat(sleepRecord1).isNotEqualTo(sleepRecord2);
    }
}
