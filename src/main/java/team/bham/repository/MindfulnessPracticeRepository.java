package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.MindfulnessPractice;

/**
 * Spring Data JPA repository for the MindfulnessPractice entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MindfulnessPracticeRepository extends JpaRepository<MindfulnessPractice, Long> {}
