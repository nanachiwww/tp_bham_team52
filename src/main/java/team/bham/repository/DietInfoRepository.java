package team.bham.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import team.bham.domain.DietInfo;

/**
 * Spring Data JPA repository for the CustomGoal entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DietInfoRepository extends JpaRepository<DietInfo, Long> {}
