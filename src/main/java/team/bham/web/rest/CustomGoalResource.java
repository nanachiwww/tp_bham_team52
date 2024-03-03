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
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.CustomGoal;
import team.bham.repository.CustomGoalRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.CustomGoal}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CustomGoalResource {

    private final Logger log = LoggerFactory.getLogger(CustomGoalResource.class);

    private static final String ENTITY_NAME = "customGoal";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CustomGoalRepository customGoalRepository;

    public CustomGoalResource(CustomGoalRepository customGoalRepository) {
        this.customGoalRepository = customGoalRepository;
    }

    /**
     * {@code POST  /custom-goals} : Create a new customGoal.
     *
     * @param customGoal the customGoal to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new customGoal, or with status {@code 400 (Bad Request)} if the customGoal has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/custom-goals")
    public ResponseEntity<CustomGoal> createCustomGoal(@Valid @RequestBody CustomGoal customGoal) throws URISyntaxException {
        log.debug("REST request to save CustomGoal : {}", customGoal);
        if (customGoal.getId() != null) {
            throw new BadRequestAlertException("A new customGoal cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CustomGoal result = customGoalRepository.save(customGoal);
        return ResponseEntity
            .created(new URI("/api/custom-goals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /custom-goals/:id} : Updates an existing customGoal.
     *
     * @param id the id of the customGoal to save.
     * @param customGoal the customGoal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated customGoal,
     * or with status {@code 400 (Bad Request)} if the customGoal is not valid,
     * or with status {@code 500 (Internal Server Error)} if the customGoal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/custom-goals/{id}")
    public ResponseEntity<CustomGoal> updateCustomGoal(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CustomGoal customGoal
    ) throws URISyntaxException {
        log.debug("REST request to update CustomGoal : {}, {}", id, customGoal);
        if (customGoal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, customGoal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!customGoalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CustomGoal result = customGoalRepository.save(customGoal);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, customGoal.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /custom-goals/:id} : Partial updates given fields of an existing customGoal, field will ignore if it is null
     *
     * @param id the id of the customGoal to save.
     * @param customGoal the customGoal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated customGoal,
     * or with status {@code 400 (Bad Request)} if the customGoal is not valid,
     * or with status {@code 404 (Not Found)} if the customGoal is not found,
     * or with status {@code 500 (Internal Server Error)} if the customGoal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/custom-goals/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CustomGoal> partialUpdateCustomGoal(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CustomGoal customGoal
    ) throws URISyntaxException {
        log.debug("REST request to partial update CustomGoal partially : {}, {}", id, customGoal);
        if (customGoal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, customGoal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!customGoalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CustomGoal> result = customGoalRepository
            .findById(customGoal.getId())
            .map(existingCustomGoal -> {
                if (customGoal.getName() != null) {
                    existingCustomGoal.setName(customGoal.getName());
                }
                if (customGoal.getDescription() != null) {
                    existingCustomGoal.setDescription(customGoal.getDescription());
                }

                return existingCustomGoal;
            })
            .map(customGoalRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, customGoal.getId().toString())
        );
    }

    /**
     * {@code GET  /custom-goals} : get all the customGoals.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of customGoals in body.
     */
    @GetMapping("/custom-goals")
    public List<CustomGoal> getAllCustomGoals() {
        log.debug("REST request to get all CustomGoals");
        return customGoalRepository.findAll();
    }

    /**
     * {@code GET  /custom-goals/:id} : get the "id" customGoal.
     *
     * @param id the id of the customGoal to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the customGoal, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/custom-goals/{id}")
    public ResponseEntity<CustomGoal> getCustomGoal(@PathVariable Long id) {
        log.debug("REST request to get CustomGoal : {}", id);
        Optional<CustomGoal> customGoal = customGoalRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(customGoal);
    }

    /**
     * {@code DELETE  /custom-goals/:id} : delete the "id" customGoal.
     *
     * @param id the id of the customGoal to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/custom-goals/{id}")
    public ResponseEntity<Void> deleteCustomGoal(@PathVariable Long id) {
        log.debug("REST request to delete CustomGoal : {}", id);
        customGoalRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
