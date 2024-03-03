package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.CompareResult;

/**
 * Spring Data JPA repository for the CompareResult entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompareResultRepository extends JpaRepository<CompareResult, Long> {}
