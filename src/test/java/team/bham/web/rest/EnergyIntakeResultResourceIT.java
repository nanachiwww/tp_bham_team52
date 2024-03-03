package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.EnergyIntakeResult;
import team.bham.repository.EnergyIntakeResultRepository;

/**
 * Integration tests for the {@link EnergyIntakeResultResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EnergyIntakeResultResourceIT {

    private static final Boolean DEFAULT_GOAL_COMPLETE = false;
    private static final Boolean UPDATED_GOAL_COMPLETE = true;

    private static final String DEFAULT_DETAILS = "AAAAAAAAAA";
    private static final String UPDATED_DETAILS = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/energy-intake-results";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EnergyIntakeResultRepository energyIntakeResultRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEnergyIntakeResultMockMvc;

    private EnergyIntakeResult energyIntakeResult;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EnergyIntakeResult createEntity(EntityManager em) {
        EnergyIntakeResult energyIntakeResult = new EnergyIntakeResult()
            .goalComplete(DEFAULT_GOAL_COMPLETE)
            .details(DEFAULT_DETAILS)
            .date(DEFAULT_DATE);
        return energyIntakeResult;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EnergyIntakeResult createUpdatedEntity(EntityManager em) {
        EnergyIntakeResult energyIntakeResult = new EnergyIntakeResult()
            .goalComplete(UPDATED_GOAL_COMPLETE)
            .details(UPDATED_DETAILS)
            .date(UPDATED_DATE);
        return energyIntakeResult;
    }

    @BeforeEach
    public void initTest() {
        energyIntakeResult = createEntity(em);
    }

    @Test
    @Transactional
    void createEnergyIntakeResult() throws Exception {
        int databaseSizeBeforeCreate = energyIntakeResultRepository.findAll().size();
        // Create the EnergyIntakeResult
        restEnergyIntakeResultMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(energyIntakeResult))
            )
            .andExpect(status().isCreated());

        // Validate the EnergyIntakeResult in the database
        List<EnergyIntakeResult> energyIntakeResultList = energyIntakeResultRepository.findAll();
        assertThat(energyIntakeResultList).hasSize(databaseSizeBeforeCreate + 1);
        EnergyIntakeResult testEnergyIntakeResult = energyIntakeResultList.get(energyIntakeResultList.size() - 1);
        assertThat(testEnergyIntakeResult.getGoalComplete()).isEqualTo(DEFAULT_GOAL_COMPLETE);
        assertThat(testEnergyIntakeResult.getDetails()).isEqualTo(DEFAULT_DETAILS);
        assertThat(testEnergyIntakeResult.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createEnergyIntakeResultWithExistingId() throws Exception {
        // Create the EnergyIntakeResult with an existing ID
        energyIntakeResult.setId(1L);

        int databaseSizeBeforeCreate = energyIntakeResultRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEnergyIntakeResultMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(energyIntakeResult))
            )
            .andExpect(status().isBadRequest());

        // Validate the EnergyIntakeResult in the database
        List<EnergyIntakeResult> energyIntakeResultList = energyIntakeResultRepository.findAll();
        assertThat(energyIntakeResultList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = energyIntakeResultRepository.findAll().size();
        // set the field null
        energyIntakeResult.setDate(null);

        // Create the EnergyIntakeResult, which fails.

        restEnergyIntakeResultMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(energyIntakeResult))
            )
            .andExpect(status().isBadRequest());

        List<EnergyIntakeResult> energyIntakeResultList = energyIntakeResultRepository.findAll();
        assertThat(energyIntakeResultList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEnergyIntakeResults() throws Exception {
        // Initialize the database
        energyIntakeResultRepository.saveAndFlush(energyIntakeResult);

        // Get all the energyIntakeResultList
        restEnergyIntakeResultMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(energyIntakeResult.getId().intValue())))
            .andExpect(jsonPath("$.[*].goalComplete").value(hasItem(DEFAULT_GOAL_COMPLETE.booleanValue())))
            .andExpect(jsonPath("$.[*].details").value(hasItem(DEFAULT_DETAILS)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getEnergyIntakeResult() throws Exception {
        // Initialize the database
        energyIntakeResultRepository.saveAndFlush(energyIntakeResult);

        // Get the energyIntakeResult
        restEnergyIntakeResultMockMvc
            .perform(get(ENTITY_API_URL_ID, energyIntakeResult.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(energyIntakeResult.getId().intValue()))
            .andExpect(jsonPath("$.goalComplete").value(DEFAULT_GOAL_COMPLETE.booleanValue()))
            .andExpect(jsonPath("$.details").value(DEFAULT_DETAILS))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingEnergyIntakeResult() throws Exception {
        // Get the energyIntakeResult
        restEnergyIntakeResultMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEnergyIntakeResult() throws Exception {
        // Initialize the database
        energyIntakeResultRepository.saveAndFlush(energyIntakeResult);

        int databaseSizeBeforeUpdate = energyIntakeResultRepository.findAll().size();

        // Update the energyIntakeResult
        EnergyIntakeResult updatedEnergyIntakeResult = energyIntakeResultRepository.findById(energyIntakeResult.getId()).get();
        // Disconnect from session so that the updates on updatedEnergyIntakeResult are not directly saved in db
        em.detach(updatedEnergyIntakeResult);
        updatedEnergyIntakeResult.goalComplete(UPDATED_GOAL_COMPLETE).details(UPDATED_DETAILS).date(UPDATED_DATE);

        restEnergyIntakeResultMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEnergyIntakeResult.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEnergyIntakeResult))
            )
            .andExpect(status().isOk());

        // Validate the EnergyIntakeResult in the database
        List<EnergyIntakeResult> energyIntakeResultList = energyIntakeResultRepository.findAll();
        assertThat(energyIntakeResultList).hasSize(databaseSizeBeforeUpdate);
        EnergyIntakeResult testEnergyIntakeResult = energyIntakeResultList.get(energyIntakeResultList.size() - 1);
        assertThat(testEnergyIntakeResult.getGoalComplete()).isEqualTo(UPDATED_GOAL_COMPLETE);
        assertThat(testEnergyIntakeResult.getDetails()).isEqualTo(UPDATED_DETAILS);
        assertThat(testEnergyIntakeResult.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingEnergyIntakeResult() throws Exception {
        int databaseSizeBeforeUpdate = energyIntakeResultRepository.findAll().size();
        energyIntakeResult.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEnergyIntakeResultMockMvc
            .perform(
                put(ENTITY_API_URL_ID, energyIntakeResult.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(energyIntakeResult))
            )
            .andExpect(status().isBadRequest());

        // Validate the EnergyIntakeResult in the database
        List<EnergyIntakeResult> energyIntakeResultList = energyIntakeResultRepository.findAll();
        assertThat(energyIntakeResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEnergyIntakeResult() throws Exception {
        int databaseSizeBeforeUpdate = energyIntakeResultRepository.findAll().size();
        energyIntakeResult.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnergyIntakeResultMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(energyIntakeResult))
            )
            .andExpect(status().isBadRequest());

        // Validate the EnergyIntakeResult in the database
        List<EnergyIntakeResult> energyIntakeResultList = energyIntakeResultRepository.findAll();
        assertThat(energyIntakeResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEnergyIntakeResult() throws Exception {
        int databaseSizeBeforeUpdate = energyIntakeResultRepository.findAll().size();
        energyIntakeResult.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnergyIntakeResultMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(energyIntakeResult))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EnergyIntakeResult in the database
        List<EnergyIntakeResult> energyIntakeResultList = energyIntakeResultRepository.findAll();
        assertThat(energyIntakeResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEnergyIntakeResultWithPatch() throws Exception {
        // Initialize the database
        energyIntakeResultRepository.saveAndFlush(energyIntakeResult);

        int databaseSizeBeforeUpdate = energyIntakeResultRepository.findAll().size();

        // Update the energyIntakeResult using partial update
        EnergyIntakeResult partialUpdatedEnergyIntakeResult = new EnergyIntakeResult();
        partialUpdatedEnergyIntakeResult.setId(energyIntakeResult.getId());

        partialUpdatedEnergyIntakeResult.goalComplete(UPDATED_GOAL_COMPLETE).details(UPDATED_DETAILS).date(UPDATED_DATE);

        restEnergyIntakeResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEnergyIntakeResult.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEnergyIntakeResult))
            )
            .andExpect(status().isOk());

        // Validate the EnergyIntakeResult in the database
        List<EnergyIntakeResult> energyIntakeResultList = energyIntakeResultRepository.findAll();
        assertThat(energyIntakeResultList).hasSize(databaseSizeBeforeUpdate);
        EnergyIntakeResult testEnergyIntakeResult = energyIntakeResultList.get(energyIntakeResultList.size() - 1);
        assertThat(testEnergyIntakeResult.getGoalComplete()).isEqualTo(UPDATED_GOAL_COMPLETE);
        assertThat(testEnergyIntakeResult.getDetails()).isEqualTo(UPDATED_DETAILS);
        assertThat(testEnergyIntakeResult.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateEnergyIntakeResultWithPatch() throws Exception {
        // Initialize the database
        energyIntakeResultRepository.saveAndFlush(energyIntakeResult);

        int databaseSizeBeforeUpdate = energyIntakeResultRepository.findAll().size();

        // Update the energyIntakeResult using partial update
        EnergyIntakeResult partialUpdatedEnergyIntakeResult = new EnergyIntakeResult();
        partialUpdatedEnergyIntakeResult.setId(energyIntakeResult.getId());

        partialUpdatedEnergyIntakeResult.goalComplete(UPDATED_GOAL_COMPLETE).details(UPDATED_DETAILS).date(UPDATED_DATE);

        restEnergyIntakeResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEnergyIntakeResult.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEnergyIntakeResult))
            )
            .andExpect(status().isOk());

        // Validate the EnergyIntakeResult in the database
        List<EnergyIntakeResult> energyIntakeResultList = energyIntakeResultRepository.findAll();
        assertThat(energyIntakeResultList).hasSize(databaseSizeBeforeUpdate);
        EnergyIntakeResult testEnergyIntakeResult = energyIntakeResultList.get(energyIntakeResultList.size() - 1);
        assertThat(testEnergyIntakeResult.getGoalComplete()).isEqualTo(UPDATED_GOAL_COMPLETE);
        assertThat(testEnergyIntakeResult.getDetails()).isEqualTo(UPDATED_DETAILS);
        assertThat(testEnergyIntakeResult.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingEnergyIntakeResult() throws Exception {
        int databaseSizeBeforeUpdate = energyIntakeResultRepository.findAll().size();
        energyIntakeResult.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEnergyIntakeResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, energyIntakeResult.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(energyIntakeResult))
            )
            .andExpect(status().isBadRequest());

        // Validate the EnergyIntakeResult in the database
        List<EnergyIntakeResult> energyIntakeResultList = energyIntakeResultRepository.findAll();
        assertThat(energyIntakeResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEnergyIntakeResult() throws Exception {
        int databaseSizeBeforeUpdate = energyIntakeResultRepository.findAll().size();
        energyIntakeResult.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnergyIntakeResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(energyIntakeResult))
            )
            .andExpect(status().isBadRequest());

        // Validate the EnergyIntakeResult in the database
        List<EnergyIntakeResult> energyIntakeResultList = energyIntakeResultRepository.findAll();
        assertThat(energyIntakeResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEnergyIntakeResult() throws Exception {
        int databaseSizeBeforeUpdate = energyIntakeResultRepository.findAll().size();
        energyIntakeResult.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnergyIntakeResultMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(energyIntakeResult))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EnergyIntakeResult in the database
        List<EnergyIntakeResult> energyIntakeResultList = energyIntakeResultRepository.findAll();
        assertThat(energyIntakeResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEnergyIntakeResult() throws Exception {
        // Initialize the database
        energyIntakeResultRepository.saveAndFlush(energyIntakeResult);

        int databaseSizeBeforeDelete = energyIntakeResultRepository.findAll().size();

        // Delete the energyIntakeResult
        restEnergyIntakeResultMockMvc
            .perform(delete(ENTITY_API_URL_ID, energyIntakeResult.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EnergyIntakeResult> energyIntakeResultList = energyIntakeResultRepository.findAll();
        assertThat(energyIntakeResultList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
