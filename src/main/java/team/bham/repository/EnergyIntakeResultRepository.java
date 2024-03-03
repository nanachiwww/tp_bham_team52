package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.EnergyIntakeResult;

/**
 * Spring Data JPA repository for the EnergyIntakeResult entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EnergyIntakeResultRepository extends JpaRepository<EnergyIntakeResult, Long> {}
