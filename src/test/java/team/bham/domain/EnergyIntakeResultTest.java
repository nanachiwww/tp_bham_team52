package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class EnergyIntakeResultTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EnergyIntakeResult.class);
        EnergyIntakeResult energyIntakeResult1 = new EnergyIntakeResult();
        energyIntakeResult1.setId(1L);
        EnergyIntakeResult energyIntakeResult2 = new EnergyIntakeResult();
        energyIntakeResult2.setId(energyIntakeResult1.getId());
        assertThat(energyIntakeResult1).isEqualTo(energyIntakeResult2);
        energyIntakeResult2.setId(2L);
        assertThat(energyIntakeResult1).isNotEqualTo(energyIntakeResult2);
        energyIntakeResult1.setId(null);
        assertThat(energyIntakeResult1).isNotEqualTo(energyIntakeResult2);
    }
}
