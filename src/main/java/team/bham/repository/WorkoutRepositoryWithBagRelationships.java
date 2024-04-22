package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.Workout;

public interface WorkoutRepositoryWithBagRelationships {
    Optional<Workout> fetchBagRelationships(Optional<Workout> workout);

    List<Workout> fetchBagRelationships(List<Workout> workouts);

    Page<Workout> fetchBagRelationships(Page<Workout> workouts);
}
