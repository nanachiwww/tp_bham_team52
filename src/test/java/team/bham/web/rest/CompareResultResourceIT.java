package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
import team.bham.domain.CompareResult;
import team.bham.repository.CompareResultRepository;

/**
 * Integration tests for the {@link CompareResultResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CompareResultResourceIT {

    private static final String DEFAULT_RESULT_DETAILS = "AAAAAAAAAA";
    private static final String UPDATED_RESULT_DETAILS = "BBBBBBBBBB";

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_DIETARY_GOAL_COMPLETE = false;
    private static final Boolean UPDATED_DIETARY_GOAL_COMPLETE = true;

    private static final Boolean DEFAULT_MOOD_GOAL_ACHIEVED = false;
    private static final Boolean UPDATED_MOOD_GOAL_ACHIEVED = true;

    private static final Boolean DEFAULT_WORKOUT_GOAL_ACHIEVED = false;
    private static final Boolean UPDATED_WORKOUT_GOAL_ACHIEVED = true;

    private static final Boolean DEFAULT_SLEEP_GOAL_ACHIEVED = false;
    private static final Boolean UPDATED_SLEEP_GOAL_ACHIEVED = true;

    private static final String ENTITY_API_URL = "/api/compare-results";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CompareResultRepository compareResultRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCompareResultMockMvc;

    private CompareResult compareResult;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompareResult createEntity(EntityManager em) {
        CompareResult compareResult = new CompareResult()
            .resultDetails(DEFAULT_RESULT_DETAILS)
            .timestamp(DEFAULT_TIMESTAMP)
            .dietaryGoalComplete(DEFAULT_DIETARY_GOAL_COMPLETE)
            .moodGoalAchieved(DEFAULT_MOOD_GOAL_ACHIEVED)
            .workoutGoalAchieved(DEFAULT_WORKOUT_GOAL_ACHIEVED)
            .sleepGoalAchieved(DEFAULT_SLEEP_GOAL_ACHIEVED);
        return compareResult;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompareResult createUpdatedEntity(EntityManager em) {
        CompareResult compareResult = new CompareResult()
            .resultDetails(UPDATED_RESULT_DETAILS)
            .timestamp(UPDATED_TIMESTAMP)
            .dietaryGoalComplete(UPDATED_DIETARY_GOAL_COMPLETE)
            .moodGoalAchieved(UPDATED_MOOD_GOAL_ACHIEVED)
            .workoutGoalAchieved(UPDATED_WORKOUT_GOAL_ACHIEVED)
            .sleepGoalAchieved(UPDATED_SLEEP_GOAL_ACHIEVED);
        return compareResult;
    }

    @BeforeEach
    public void initTest() {
        compareResult = createEntity(em);
    }

    @Test
    @Transactional
    void createCompareResult() throws Exception {
        int databaseSizeBeforeCreate = compareResultRepository.findAll().size();
        // Create the CompareResult
        restCompareResultMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compareResult)))
            .andExpect(status().isCreated());

        // Validate the CompareResult in the database
        List<CompareResult> compareResultList = compareResultRepository.findAll();
        assertThat(compareResultList).hasSize(databaseSizeBeforeCreate + 1);
        CompareResult testCompareResult = compareResultList.get(compareResultList.size() - 1);
        assertThat(testCompareResult.getResultDetails()).isEqualTo(DEFAULT_RESULT_DETAILS);
        assertThat(testCompareResult.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testCompareResult.getDietaryGoalComplete()).isEqualTo(DEFAULT_DIETARY_GOAL_COMPLETE);
        assertThat(testCompareResult.getMoodGoalAchieved()).isEqualTo(DEFAULT_MOOD_GOAL_ACHIEVED);
        assertThat(testCompareResult.getWorkoutGoalAchieved()).isEqualTo(DEFAULT_WORKOUT_GOAL_ACHIEVED);
        assertThat(testCompareResult.getSleepGoalAchieved()).isEqualTo(DEFAULT_SLEEP_GOAL_ACHIEVED);
    }

    @Test
    @Transactional
    void createCompareResultWithExistingId() throws Exception {
        // Create the CompareResult with an existing ID
        compareResult.setId(1L);

        int databaseSizeBeforeCreate = compareResultRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompareResultMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compareResult)))
            .andExpect(status().isBadRequest());

        // Validate the CompareResult in the database
        List<CompareResult> compareResultList = compareResultRepository.findAll();
        assertThat(compareResultList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCompareResults() throws Exception {
        // Initialize the database
        compareResultRepository.saveAndFlush(compareResult);

        // Get all the compareResultList
        restCompareResultMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(compareResult.getId().intValue())))
            .andExpect(jsonPath("$.[*].resultDetails").value(hasItem(DEFAULT_RESULT_DETAILS)))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())))
            .andExpect(jsonPath("$.[*].dietaryGoalComplete").value(hasItem(DEFAULT_DIETARY_GOAL_COMPLETE.booleanValue())))
            .andExpect(jsonPath("$.[*].moodGoalAchieved").value(hasItem(DEFAULT_MOOD_GOAL_ACHIEVED.booleanValue())))
            .andExpect(jsonPath("$.[*].workoutGoalAchieved").value(hasItem(DEFAULT_WORKOUT_GOAL_ACHIEVED.booleanValue())))
            .andExpect(jsonPath("$.[*].sleepGoalAchieved").value(hasItem(DEFAULT_SLEEP_GOAL_ACHIEVED.booleanValue())));
    }

    @Test
    @Transactional
    void getCompareResult() throws Exception {
        // Initialize the database
        compareResultRepository.saveAndFlush(compareResult);

        // Get the compareResult
        restCompareResultMockMvc
            .perform(get(ENTITY_API_URL_ID, compareResult.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(compareResult.getId().intValue()))
            .andExpect(jsonPath("$.resultDetails").value(DEFAULT_RESULT_DETAILS))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()))
            .andExpect(jsonPath("$.dietaryGoalComplete").value(DEFAULT_DIETARY_GOAL_COMPLETE.booleanValue()))
            .andExpect(jsonPath("$.moodGoalAchieved").value(DEFAULT_MOOD_GOAL_ACHIEVED.booleanValue()))
            .andExpect(jsonPath("$.workoutGoalAchieved").value(DEFAULT_WORKOUT_GOAL_ACHIEVED.booleanValue()))
            .andExpect(jsonPath("$.sleepGoalAchieved").value(DEFAULT_SLEEP_GOAL_ACHIEVED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingCompareResult() throws Exception {
        // Get the compareResult
        restCompareResultMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCompareResult() throws Exception {
        // Initialize the database
        compareResultRepository.saveAndFlush(compareResult);

        int databaseSizeBeforeUpdate = compareResultRepository.findAll().size();

        // Update the compareResult
        CompareResult updatedCompareResult = compareResultRepository.findById(compareResult.getId()).get();
        // Disconnect from session so that the updates on updatedCompareResult are not directly saved in db
        em.detach(updatedCompareResult);
        updatedCompareResult
            .resultDetails(UPDATED_RESULT_DETAILS)
            .timestamp(UPDATED_TIMESTAMP)
            .dietaryGoalComplete(UPDATED_DIETARY_GOAL_COMPLETE)
            .moodGoalAchieved(UPDATED_MOOD_GOAL_ACHIEVED)
            .workoutGoalAchieved(UPDATED_WORKOUT_GOAL_ACHIEVED)
            .sleepGoalAchieved(UPDATED_SLEEP_GOAL_ACHIEVED);

        restCompareResultMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCompareResult.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCompareResult))
            )
            .andExpect(status().isOk());

        // Validate the CompareResult in the database
        List<CompareResult> compareResultList = compareResultRepository.findAll();
        assertThat(compareResultList).hasSize(databaseSizeBeforeUpdate);
        CompareResult testCompareResult = compareResultList.get(compareResultList.size() - 1);
        assertThat(testCompareResult.getResultDetails()).isEqualTo(UPDATED_RESULT_DETAILS);
        assertThat(testCompareResult.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testCompareResult.getDietaryGoalComplete()).isEqualTo(UPDATED_DIETARY_GOAL_COMPLETE);
        assertThat(testCompareResult.getMoodGoalAchieved()).isEqualTo(UPDATED_MOOD_GOAL_ACHIEVED);
        assertThat(testCompareResult.getWorkoutGoalAchieved()).isEqualTo(UPDATED_WORKOUT_GOAL_ACHIEVED);
        assertThat(testCompareResult.getSleepGoalAchieved()).isEqualTo(UPDATED_SLEEP_GOAL_ACHIEVED);
    }

    @Test
    @Transactional
    void putNonExistingCompareResult() throws Exception {
        int databaseSizeBeforeUpdate = compareResultRepository.findAll().size();
        compareResult.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompareResultMockMvc
            .perform(
                put(ENTITY_API_URL_ID, compareResult.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(compareResult))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompareResult in the database
        List<CompareResult> compareResultList = compareResultRepository.findAll();
        assertThat(compareResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCompareResult() throws Exception {
        int databaseSizeBeforeUpdate = compareResultRepository.findAll().size();
        compareResult.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompareResultMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(compareResult))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompareResult in the database
        List<CompareResult> compareResultList = compareResultRepository.findAll();
        assertThat(compareResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCompareResult() throws Exception {
        int databaseSizeBeforeUpdate = compareResultRepository.findAll().size();
        compareResult.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompareResultMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(compareResult)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompareResult in the database
        List<CompareResult> compareResultList = compareResultRepository.findAll();
        assertThat(compareResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCompareResultWithPatch() throws Exception {
        // Initialize the database
        compareResultRepository.saveAndFlush(compareResult);

        int databaseSizeBeforeUpdate = compareResultRepository.findAll().size();

        // Update the compareResult using partial update
        CompareResult partialUpdatedCompareResult = new CompareResult();
        partialUpdatedCompareResult.setId(compareResult.getId());

        partialUpdatedCompareResult.timestamp(UPDATED_TIMESTAMP).workoutGoalAchieved(UPDATED_WORKOUT_GOAL_ACHIEVED);

        restCompareResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompareResult.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompareResult))
            )
            .andExpect(status().isOk());

        // Validate the CompareResult in the database
        List<CompareResult> compareResultList = compareResultRepository.findAll();
        assertThat(compareResultList).hasSize(databaseSizeBeforeUpdate);
        CompareResult testCompareResult = compareResultList.get(compareResultList.size() - 1);
        assertThat(testCompareResult.getResultDetails()).isEqualTo(DEFAULT_RESULT_DETAILS);
        assertThat(testCompareResult.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testCompareResult.getDietaryGoalComplete()).isEqualTo(DEFAULT_DIETARY_GOAL_COMPLETE);
        assertThat(testCompareResult.getMoodGoalAchieved()).isEqualTo(DEFAULT_MOOD_GOAL_ACHIEVED);
        assertThat(testCompareResult.getWorkoutGoalAchieved()).isEqualTo(UPDATED_WORKOUT_GOAL_ACHIEVED);
        assertThat(testCompareResult.getSleepGoalAchieved()).isEqualTo(DEFAULT_SLEEP_GOAL_ACHIEVED);
    }

    @Test
    @Transactional
    void fullUpdateCompareResultWithPatch() throws Exception {
        // Initialize the database
        compareResultRepository.saveAndFlush(compareResult);

        int databaseSizeBeforeUpdate = compareResultRepository.findAll().size();

        // Update the compareResult using partial update
        CompareResult partialUpdatedCompareResult = new CompareResult();
        partialUpdatedCompareResult.setId(compareResult.getId());

        partialUpdatedCompareResult
            .resultDetails(UPDATED_RESULT_DETAILS)
            .timestamp(UPDATED_TIMESTAMP)
            .dietaryGoalComplete(UPDATED_DIETARY_GOAL_COMPLETE)
            .moodGoalAchieved(UPDATED_MOOD_GOAL_ACHIEVED)
            .workoutGoalAchieved(UPDATED_WORKOUT_GOAL_ACHIEVED)
            .sleepGoalAchieved(UPDATED_SLEEP_GOAL_ACHIEVED);

        restCompareResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompareResult.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompareResult))
            )
            .andExpect(status().isOk());

        // Validate the CompareResult in the database
        List<CompareResult> compareResultList = compareResultRepository.findAll();
        assertThat(compareResultList).hasSize(databaseSizeBeforeUpdate);
        CompareResult testCompareResult = compareResultList.get(compareResultList.size() - 1);
        assertThat(testCompareResult.getResultDetails()).isEqualTo(UPDATED_RESULT_DETAILS);
        assertThat(testCompareResult.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testCompareResult.getDietaryGoalComplete()).isEqualTo(UPDATED_DIETARY_GOAL_COMPLETE);
        assertThat(testCompareResult.getMoodGoalAchieved()).isEqualTo(UPDATED_MOOD_GOAL_ACHIEVED);
        assertThat(testCompareResult.getWorkoutGoalAchieved()).isEqualTo(UPDATED_WORKOUT_GOAL_ACHIEVED);
        assertThat(testCompareResult.getSleepGoalAchieved()).isEqualTo(UPDATED_SLEEP_GOAL_ACHIEVED);
    }

    @Test
    @Transactional
    void patchNonExistingCompareResult() throws Exception {
        int databaseSizeBeforeUpdate = compareResultRepository.findAll().size();
        compareResult.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompareResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, compareResult.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(compareResult))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompareResult in the database
        List<CompareResult> compareResultList = compareResultRepository.findAll();
        assertThat(compareResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCompareResult() throws Exception {
        int databaseSizeBeforeUpdate = compareResultRepository.findAll().size();
        compareResult.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompareResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(compareResult))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompareResult in the database
        List<CompareResult> compareResultList = compareResultRepository.findAll();
        assertThat(compareResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCompareResult() throws Exception {
        int databaseSizeBeforeUpdate = compareResultRepository.findAll().size();
        compareResult.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompareResultMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(compareResult))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompareResult in the database
        List<CompareResult> compareResultList = compareResultRepository.findAll();
        assertThat(compareResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCompareResult() throws Exception {
        // Initialize the database
        compareResultRepository.saveAndFlush(compareResult);

        int databaseSizeBeforeDelete = compareResultRepository.findAll().size();

        // Delete the compareResult
        restCompareResultMockMvc
            .perform(delete(ENTITY_API_URL_ID, compareResult.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CompareResult> compareResultList = compareResultRepository.findAll();
        assertThat(compareResultList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
