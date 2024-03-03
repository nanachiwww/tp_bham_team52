package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.CompareResult;
import team.bham.repository.CompareResultRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.CompareResult}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CompareResultResource {

    private final Logger log = LoggerFactory.getLogger(CompareResultResource.class);

    private static final String ENTITY_NAME = "compareResult";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompareResultRepository compareResultRepository;

    public CompareResultResource(CompareResultRepository compareResultRepository) {
        this.compareResultRepository = compareResultRepository;
    }

    /**
     * {@code POST  /compare-results} : Create a new compareResult.
     *
     * @param compareResult the compareResult to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new compareResult, or with status {@code 400 (Bad Request)} if the compareResult has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/compare-results")
    public ResponseEntity<CompareResult> createCompareResult(@RequestBody CompareResult compareResult) throws URISyntaxException {
        log.debug("REST request to save CompareResult : {}", compareResult);
        if (compareResult.getId() != null) {
            throw new BadRequestAlertException("A new compareResult cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CompareResult result = compareResultRepository.save(compareResult);
        return ResponseEntity
            .created(new URI("/api/compare-results/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /compare-results/:id} : Updates an existing compareResult.
     *
     * @param id the id of the compareResult to save.
     * @param compareResult the compareResult to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated compareResult,
     * or with status {@code 400 (Bad Request)} if the compareResult is not valid,
     * or with status {@code 500 (Internal Server Error)} if the compareResult couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/compare-results/{id}")
    public ResponseEntity<CompareResult> updateCompareResult(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompareResult compareResult
    ) throws URISyntaxException {
        log.debug("REST request to update CompareResult : {}, {}", id, compareResult);
        if (compareResult.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, compareResult.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!compareResultRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CompareResult result = compareResultRepository.save(compareResult);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, compareResult.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /compare-results/:id} : Partial updates given fields of an existing compareResult, field will ignore if it is null
     *
     * @param id the id of the compareResult to save.
     * @param compareResult the compareResult to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated compareResult,
     * or with status {@code 400 (Bad Request)} if the compareResult is not valid,
     * or with status {@code 404 (Not Found)} if the compareResult is not found,
     * or with status {@code 500 (Internal Server Error)} if the compareResult couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/compare-results/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CompareResult> partialUpdateCompareResult(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompareResult compareResult
    ) throws URISyntaxException {
        log.debug("REST request to partial update CompareResult partially : {}, {}", id, compareResult);
        if (compareResult.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, compareResult.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!compareResultRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CompareResult> result = compareResultRepository
            .findById(compareResult.getId())
            .map(existingCompareResult -> {
                if (compareResult.getResultDetails() != null) {
                    existingCompareResult.setResultDetails(compareResult.getResultDetails());
                }
                if (compareResult.getTimestamp() != null) {
                    existingCompareResult.setTimestamp(compareResult.getTimestamp());
                }
                if (compareResult.getDietaryGoalComplete() != null) {
                    existingCompareResult.setDietaryGoalComplete(compareResult.getDietaryGoalComplete());
                }
                if (compareResult.getMoodGoalAchieved() != null) {
                    existingCompareResult.setMoodGoalAchieved(compareResult.getMoodGoalAchieved());
                }
                if (compareResult.getWorkoutGoalAchieved() != null) {
                    existingCompareResult.setWorkoutGoalAchieved(compareResult.getWorkoutGoalAchieved());
                }
                if (compareResult.getSleepGoalAchieved() != null) {
                    existingCompareResult.setSleepGoalAchieved(compareResult.getSleepGoalAchieved());
                }

                return existingCompareResult;
            })
            .map(compareResultRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, compareResult.getId().toString())
        );
    }

    /**
     * {@code GET  /compare-results} : get all the compareResults.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of compareResults in body.
     */
    @GetMapping("/compare-results")
    public List<CompareResult> getAllCompareResults(@RequestParam(required = false) String filter) {
        if ("userprofile-is-null".equals(filter)) {
            log.debug("REST request to get all CompareResults where userProfile is null");
            return StreamSupport
                .stream(compareResultRepository.findAll().spliterator(), false)
                .filter(compareResult -> compareResult.getUserProfile() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all CompareResults");
        return compareResultRepository.findAll();
    }

    /**
     * {@code GET  /compare-results/:id} : get the "id" compareResult.
     *
     * @param id the id of the compareResult to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the compareResult, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/compare-results/{id}")
    public ResponseEntity<CompareResult> getCompareResult(@PathVariable Long id) {
        log.debug("REST request to get CompareResult : {}", id);
        Optional<CompareResult> compareResult = compareResultRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(compareResult);
    }

    /**
     * {@code DELETE  /compare-results/:id} : delete the "id" compareResult.
     *
     * @param id the id of the compareResult to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/compare-results/{id}")
    public ResponseEntity<Void> deleteCompareResult(@PathVariable Long id) {
        log.debug("REST request to delete CompareResult : {}", id);
        compareResultRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
