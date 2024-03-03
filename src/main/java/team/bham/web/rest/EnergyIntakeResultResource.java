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
import team.bham.domain.EnergyIntakeResult;
import team.bham.repository.EnergyIntakeResultRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.EnergyIntakeResult}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EnergyIntakeResultResource {

    private final Logger log = LoggerFactory.getLogger(EnergyIntakeResultResource.class);

    private static final String ENTITY_NAME = "energyIntakeResult";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EnergyIntakeResultRepository energyIntakeResultRepository;

    public EnergyIntakeResultResource(EnergyIntakeResultRepository energyIntakeResultRepository) {
        this.energyIntakeResultRepository = energyIntakeResultRepository;
    }

    /**
     * {@code POST  /energy-intake-results} : Create a new energyIntakeResult.
     *
     * @param energyIntakeResult the energyIntakeResult to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new energyIntakeResult, or with status {@code 400 (Bad Request)} if the energyIntakeResult has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/energy-intake-results")
    public ResponseEntity<EnergyIntakeResult> createEnergyIntakeResult(@Valid @RequestBody EnergyIntakeResult energyIntakeResult)
        throws URISyntaxException {
        log.debug("REST request to save EnergyIntakeResult : {}", energyIntakeResult);
        if (energyIntakeResult.getId() != null) {
            throw new BadRequestAlertException("A new energyIntakeResult cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EnergyIntakeResult result = energyIntakeResultRepository.save(energyIntakeResult);
        return ResponseEntity
            .created(new URI("/api/energy-intake-results/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /energy-intake-results/:id} : Updates an existing energyIntakeResult.
     *
     * @param id the id of the energyIntakeResult to save.
     * @param energyIntakeResult the energyIntakeResult to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated energyIntakeResult,
     * or with status {@code 400 (Bad Request)} if the energyIntakeResult is not valid,
     * or with status {@code 500 (Internal Server Error)} if the energyIntakeResult couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/energy-intake-results/{id}")
    public ResponseEntity<EnergyIntakeResult> updateEnergyIntakeResult(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EnergyIntakeResult energyIntakeResult
    ) throws URISyntaxException {
        log.debug("REST request to update EnergyIntakeResult : {}, {}", id, energyIntakeResult);
        if (energyIntakeResult.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, energyIntakeResult.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!energyIntakeResultRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EnergyIntakeResult result = energyIntakeResultRepository.save(energyIntakeResult);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, energyIntakeResult.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /energy-intake-results/:id} : Partial updates given fields of an existing energyIntakeResult, field will ignore if it is null
     *
     * @param id the id of the energyIntakeResult to save.
     * @param energyIntakeResult the energyIntakeResult to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated energyIntakeResult,
     * or with status {@code 400 (Bad Request)} if the energyIntakeResult is not valid,
     * or with status {@code 404 (Not Found)} if the energyIntakeResult is not found,
     * or with status {@code 500 (Internal Server Error)} if the energyIntakeResult couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/energy-intake-results/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EnergyIntakeResult> partialUpdateEnergyIntakeResult(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EnergyIntakeResult energyIntakeResult
    ) throws URISyntaxException {
        log.debug("REST request to partial update EnergyIntakeResult partially : {}, {}", id, energyIntakeResult);
        if (energyIntakeResult.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, energyIntakeResult.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!energyIntakeResultRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EnergyIntakeResult> result = energyIntakeResultRepository
            .findById(energyIntakeResult.getId())
            .map(existingEnergyIntakeResult -> {
                if (energyIntakeResult.getGoalComplete() != null) {
                    existingEnergyIntakeResult.setGoalComplete(energyIntakeResult.getGoalComplete());
                }
                if (energyIntakeResult.getDetails() != null) {
                    existingEnergyIntakeResult.setDetails(energyIntakeResult.getDetails());
                }
                if (energyIntakeResult.getDate() != null) {
                    existingEnergyIntakeResult.setDate(energyIntakeResult.getDate());
                }

                return existingEnergyIntakeResult;
            })
            .map(energyIntakeResultRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, energyIntakeResult.getId().toString())
        );
    }

    /**
     * {@code GET  /energy-intake-results} : get all the energyIntakeResults.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of energyIntakeResults in body.
     */
    @GetMapping("/energy-intake-results")
    public List<EnergyIntakeResult> getAllEnergyIntakeResults() {
        log.debug("REST request to get all EnergyIntakeResults");
        return energyIntakeResultRepository.findAll();
    }

    /**
     * {@code GET  /energy-intake-results/:id} : get the "id" energyIntakeResult.
     *
     * @param id the id of the energyIntakeResult to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the energyIntakeResult, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/energy-intake-results/{id}")
    public ResponseEntity<EnergyIntakeResult> getEnergyIntakeResult(@PathVariable Long id) {
        log.debug("REST request to get EnergyIntakeResult : {}", id);
        Optional<EnergyIntakeResult> energyIntakeResult = energyIntakeResultRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(energyIntakeResult);
    }

    /**
     * {@code DELETE  /energy-intake-results/:id} : delete the "id" energyIntakeResult.
     *
     * @param id the id of the energyIntakeResult to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/energy-intake-results/{id}")
    public ResponseEntity<Void> deleteEnergyIntakeResult(@PathVariable Long id) {
        log.debug("REST request to delete EnergyIntakeResult : {}", id);
        energyIntakeResultRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
