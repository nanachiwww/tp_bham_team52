package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Exercise;
import team.bham.domain.Workout;
// Add this import statement at the top of your file
import team.bham.repository.ExerciseRepository;
import team.bham.repository.WorkoutRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Workout}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class WorkoutResource {

    private final Logger log = LoggerFactory.getLogger(WorkoutResource.class);

    private static final String ENTITY_NAME = "workout";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;

    public WorkoutResource(WorkoutRepository workoutRepository, ExerciseRepository exerciseRepository) {
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
    }

    // Add this field to your WorkoutResource class

    /**
     * {@code POST  /workouts} : Create a new workout.
     *
     * @param workout the workout to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new workout, or with status {@code 400 (Bad Request)} if the workout has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/workouts")
    public ResponseEntity<Workout> createWorkout(@Valid @RequestBody Workout workout) throws URISyntaxException {
        log.debug("REST request to save Workout : {}", workout);
        if (workout.getId() != null) {
            throw new BadRequestAlertException("A new workout cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Workout result = workoutRepository.save(workout);
        return ResponseEntity
            .created(new URI("/api/workouts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    // Add this method to your WorkoutResource class
    @PostMapping("/workouts/{id}/exercises")
    public ResponseEntity<Workout> addExercisesToWorkout(@PathVariable Long id, @RequestBody List<Long> exerciseIds) {
        Optional<Workout> workoutOptional = workoutRepository.findById(id);
        if (!workoutOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Workout workout = workoutOptional.get();
        for (Long exerciseId : exerciseIds) {
            Optional<Exercise> exerciseOptional = exerciseRepository.findById(exerciseId);
            if (!exerciseOptional.isPresent()) {
                throw new ExerciseNotFoundException(exerciseId);
            }

            workout.addExercises(exerciseOptional.get());
        }

        workoutRepository.save(workout);
        return ResponseEntity.ok().body(workout);
    }

    public class ExerciseNotFoundException extends RuntimeException {

        public ExerciseNotFoundException(Long id) {
            super("Exercise with id " + id + " not found");
        }
    }

    @ControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(ExerciseNotFoundException.class)
        public ResponseEntity<String> handleExerciseNotFoundException(ExerciseNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    /**
     * {@code PUT  /workouts/:id} : Updates an existing workout.
     *
     * @param id the id of the workout to save.
     * @param workout the workout to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workout,
     * or with status {@code 400 (Bad Request)} if the workout is not valid,
     * or with status {@code 500 (Internal Server Error)} if the workout couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/workouts/{id}")
    public ResponseEntity<Workout> updateWorkout(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Workout workout
    ) throws URISyntaxException {
        log.debug("REST request to update Workout : {}, {}", id, workout);
        if (workout.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, workout.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!workoutRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Workout result = workoutRepository.save(workout);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, workout.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /workouts/:id} : Partial updates given fields of an existing workout, field will ignore if it is null
     *
     * @param id the id of the workout to save.
     * @param workout the workout to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workout,
     * or with status {@code 400 (Bad Request)} if the workout is not valid,
     * or with status {@code 404 (Not Found)} if the workout is not found,
     * or with status {@code 500 (Internal Server Error)} if the workout couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/workouts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Workout> partialUpdateWorkout(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Workout workout
    ) throws URISyntaxException {
        log.debug("REST request to partial update Workout partially : {}, {}", id, workout);
        if (workout.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, workout.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!workoutRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Workout> result = workoutRepository
            .findById(workout.getId())
            .map(existingWorkout -> {
                if (workout.getName() != null) {
                    existingWorkout.setName(workout.getName());
                }
                if (workout.getDescription() != null) {
                    existingWorkout.setDescription(workout.getDescription());
                }
                if (workout.getDuration() != null) {
                    existingWorkout.setDuration(workout.getDuration());
                }
                if (workout.getIntensityLevel() != null) {
                    existingWorkout.setIntensityLevel(workout.getIntensityLevel());
                }

                return existingWorkout;
            })
            .map(workoutRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, workout.getId().toString())
        );
    }

    /**
     * {@code GET  /workouts} : get all the workouts.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of workouts in body.
     */
    @GetMapping("/workouts")
    public List<Workout> getAllWorkouts(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Workouts");
        if (eagerload) {
            return workoutRepository.findAllWithEagerRelationships();
        } else {
            return workoutRepository.findAll();
        }
    }

    /**
     * {@code GET  /workouts/:id} : get the "id" workout.
     *
     * @param id the id of the workout to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the workout, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/workouts/{id}")
    public ResponseEntity<Workout> getWorkout(@PathVariable Long id) {
        log.debug("REST request to get Workout : {}", id);
        Optional<Workout> workout = workoutRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(workout);
    }

    /**
     * {@code DELETE  /workouts/:id} : delete the "id" workout.
     *
     * @param id the id of the workout to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/workouts/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        log.debug("REST request to delete Workout : {}", id);
        workoutRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
