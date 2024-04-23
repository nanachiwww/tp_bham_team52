package team.bham.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import team.bham.domain.Workout;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class WorkoutRepositoryWithBagRelationshipsImpl implements WorkoutRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Workout> fetchBagRelationships(Optional<Workout> workout) {
        return workout.map(this::fetchExercises);
    }

    @Override
    public Page<Workout> fetchBagRelationships(Page<Workout> workouts) {
        return new PageImpl<>(fetchBagRelationships(workouts.getContent()), workouts.getPageable(), workouts.getTotalElements());
    }

    @Override
    public List<Workout> fetchBagRelationships(List<Workout> workouts) {
        return Optional.of(workouts).map(this::fetchExercises).orElse(Collections.emptyList());
    }

    Workout fetchExercises(Workout result) {
        return entityManager
            .createQuery("select workout from Workout workout left join fetch workout.exercises where workout is :workout", Workout.class)
            .setParameter("workout", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Workout> fetchExercises(List<Workout> workouts) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, workouts.size()).forEach(index -> order.put(workouts.get(index).getId(), index));
        List<Workout> result = entityManager
            .createQuery(
                "select distinct workout from Workout workout left join fetch workout.exercises where workout in :workouts",
                Workout.class
            )
            .setParameter("workouts", workouts)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
