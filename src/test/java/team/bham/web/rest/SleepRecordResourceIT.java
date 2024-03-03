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
import team.bham.domain.SleepRecord;
import team.bham.repository.SleepRecordRepository;

/**
 * Integration tests for the {@link SleepRecordResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SleepRecordResourceIT {

    private static final Instant DEFAULT_START_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Integer DEFAULT_RATING = 1;
    private static final Integer UPDATED_RATING = 2;

    private static final String ENTITY_API_URL = "/api/sleep-records";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SleepRecordRepository sleepRecordRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSleepRecordMockMvc;

    private SleepRecord sleepRecord;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SleepRecord createEntity(EntityManager em) {
        SleepRecord sleepRecord = new SleepRecord().startTime(DEFAULT_START_TIME).endTime(DEFAULT_END_TIME).rating(DEFAULT_RATING);
        return sleepRecord;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SleepRecord createUpdatedEntity(EntityManager em) {
        SleepRecord sleepRecord = new SleepRecord().startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).rating(UPDATED_RATING);
        return sleepRecord;
    }

    @BeforeEach
    public void initTest() {
        sleepRecord = createEntity(em);
    }

    @Test
    @Transactional
    void createSleepRecord() throws Exception {
        int databaseSizeBeforeCreate = sleepRecordRepository.findAll().size();
        // Create the SleepRecord
        restSleepRecordMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sleepRecord)))
            .andExpect(status().isCreated());

        // Validate the SleepRecord in the database
        List<SleepRecord> sleepRecordList = sleepRecordRepository.findAll();
        assertThat(sleepRecordList).hasSize(databaseSizeBeforeCreate + 1);
        SleepRecord testSleepRecord = sleepRecordList.get(sleepRecordList.size() - 1);
        assertThat(testSleepRecord.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testSleepRecord.getEndTime()).isEqualTo(DEFAULT_END_TIME);
        assertThat(testSleepRecord.getRating()).isEqualTo(DEFAULT_RATING);
    }

    @Test
    @Transactional
    void createSleepRecordWithExistingId() throws Exception {
        // Create the SleepRecord with an existing ID
        sleepRecord.setId(1L);

        int databaseSizeBeforeCreate = sleepRecordRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSleepRecordMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sleepRecord)))
            .andExpect(status().isBadRequest());

        // Validate the SleepRecord in the database
        List<SleepRecord> sleepRecordList = sleepRecordRepository.findAll();
        assertThat(sleepRecordList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStartTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = sleepRecordRepository.findAll().size();
        // set the field null
        sleepRecord.setStartTime(null);

        // Create the SleepRecord, which fails.

        restSleepRecordMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sleepRecord)))
            .andExpect(status().isBadRequest());

        List<SleepRecord> sleepRecordList = sleepRecordRepository.findAll();
        assertThat(sleepRecordList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEndTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = sleepRecordRepository.findAll().size();
        // set the field null
        sleepRecord.setEndTime(null);

        // Create the SleepRecord, which fails.

        restSleepRecordMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sleepRecord)))
            .andExpect(status().isBadRequest());

        List<SleepRecord> sleepRecordList = sleepRecordRepository.findAll();
        assertThat(sleepRecordList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSleepRecords() throws Exception {
        // Initialize the database
        sleepRecordRepository.saveAndFlush(sleepRecord);

        // Get all the sleepRecordList
        restSleepRecordMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sleepRecord.getId().intValue())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING)));
    }

    @Test
    @Transactional
    void getSleepRecord() throws Exception {
        // Initialize the database
        sleepRecordRepository.saveAndFlush(sleepRecord);

        // Get the sleepRecord
        restSleepRecordMockMvc
            .perform(get(ENTITY_API_URL_ID, sleepRecord.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sleepRecord.getId().intValue()))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.endTime").value(DEFAULT_END_TIME.toString()))
            .andExpect(jsonPath("$.rating").value(DEFAULT_RATING));
    }

    @Test
    @Transactional
    void getNonExistingSleepRecord() throws Exception {
        // Get the sleepRecord
        restSleepRecordMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSleepRecord() throws Exception {
        // Initialize the database
        sleepRecordRepository.saveAndFlush(sleepRecord);

        int databaseSizeBeforeUpdate = sleepRecordRepository.findAll().size();

        // Update the sleepRecord
        SleepRecord updatedSleepRecord = sleepRecordRepository.findById(sleepRecord.getId()).get();
        // Disconnect from session so that the updates on updatedSleepRecord are not directly saved in db
        em.detach(updatedSleepRecord);
        updatedSleepRecord.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).rating(UPDATED_RATING);

        restSleepRecordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSleepRecord.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSleepRecord))
            )
            .andExpect(status().isOk());

        // Validate the SleepRecord in the database
        List<SleepRecord> sleepRecordList = sleepRecordRepository.findAll();
        assertThat(sleepRecordList).hasSize(databaseSizeBeforeUpdate);
        SleepRecord testSleepRecord = sleepRecordList.get(sleepRecordList.size() - 1);
        assertThat(testSleepRecord.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testSleepRecord.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testSleepRecord.getRating()).isEqualTo(UPDATED_RATING);
    }

    @Test
    @Transactional
    void putNonExistingSleepRecord() throws Exception {
        int databaseSizeBeforeUpdate = sleepRecordRepository.findAll().size();
        sleepRecord.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSleepRecordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sleepRecord.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sleepRecord))
            )
            .andExpect(status().isBadRequest());

        // Validate the SleepRecord in the database
        List<SleepRecord> sleepRecordList = sleepRecordRepository.findAll();
        assertThat(sleepRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSleepRecord() throws Exception {
        int databaseSizeBeforeUpdate = sleepRecordRepository.findAll().size();
        sleepRecord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSleepRecordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sleepRecord))
            )
            .andExpect(status().isBadRequest());

        // Validate the SleepRecord in the database
        List<SleepRecord> sleepRecordList = sleepRecordRepository.findAll();
        assertThat(sleepRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSleepRecord() throws Exception {
        int databaseSizeBeforeUpdate = sleepRecordRepository.findAll().size();
        sleepRecord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSleepRecordMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sleepRecord)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SleepRecord in the database
        List<SleepRecord> sleepRecordList = sleepRecordRepository.findAll();
        assertThat(sleepRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSleepRecordWithPatch() throws Exception {
        // Initialize the database
        sleepRecordRepository.saveAndFlush(sleepRecord);

        int databaseSizeBeforeUpdate = sleepRecordRepository.findAll().size();

        // Update the sleepRecord using partial update
        SleepRecord partialUpdatedSleepRecord = new SleepRecord();
        partialUpdatedSleepRecord.setId(sleepRecord.getId());

        partialUpdatedSleepRecord.rating(UPDATED_RATING);

        restSleepRecordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSleepRecord.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSleepRecord))
            )
            .andExpect(status().isOk());

        // Validate the SleepRecord in the database
        List<SleepRecord> sleepRecordList = sleepRecordRepository.findAll();
        assertThat(sleepRecordList).hasSize(databaseSizeBeforeUpdate);
        SleepRecord testSleepRecord = sleepRecordList.get(sleepRecordList.size() - 1);
        assertThat(testSleepRecord.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testSleepRecord.getEndTime()).isEqualTo(DEFAULT_END_TIME);
        assertThat(testSleepRecord.getRating()).isEqualTo(UPDATED_RATING);
    }

    @Test
    @Transactional
    void fullUpdateSleepRecordWithPatch() throws Exception {
        // Initialize the database
        sleepRecordRepository.saveAndFlush(sleepRecord);

        int databaseSizeBeforeUpdate = sleepRecordRepository.findAll().size();

        // Update the sleepRecord using partial update
        SleepRecord partialUpdatedSleepRecord = new SleepRecord();
        partialUpdatedSleepRecord.setId(sleepRecord.getId());

        partialUpdatedSleepRecord.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).rating(UPDATED_RATING);

        restSleepRecordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSleepRecord.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSleepRecord))
            )
            .andExpect(status().isOk());

        // Validate the SleepRecord in the database
        List<SleepRecord> sleepRecordList = sleepRecordRepository.findAll();
        assertThat(sleepRecordList).hasSize(databaseSizeBeforeUpdate);
        SleepRecord testSleepRecord = sleepRecordList.get(sleepRecordList.size() - 1);
        assertThat(testSleepRecord.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testSleepRecord.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testSleepRecord.getRating()).isEqualTo(UPDATED_RATING);
    }

    @Test
    @Transactional
    void patchNonExistingSleepRecord() throws Exception {
        int databaseSizeBeforeUpdate = sleepRecordRepository.findAll().size();
        sleepRecord.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSleepRecordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sleepRecord.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sleepRecord))
            )
            .andExpect(status().isBadRequest());

        // Validate the SleepRecord in the database
        List<SleepRecord> sleepRecordList = sleepRecordRepository.findAll();
        assertThat(sleepRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSleepRecord() throws Exception {
        int databaseSizeBeforeUpdate = sleepRecordRepository.findAll().size();
        sleepRecord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSleepRecordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sleepRecord))
            )
            .andExpect(status().isBadRequest());

        // Validate the SleepRecord in the database
        List<SleepRecord> sleepRecordList = sleepRecordRepository.findAll();
        assertThat(sleepRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSleepRecord() throws Exception {
        int databaseSizeBeforeUpdate = sleepRecordRepository.findAll().size();
        sleepRecord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSleepRecordMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sleepRecord))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SleepRecord in the database
        List<SleepRecord> sleepRecordList = sleepRecordRepository.findAll();
        assertThat(sleepRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSleepRecord() throws Exception {
        // Initialize the database
        sleepRecordRepository.saveAndFlush(sleepRecord);

        int databaseSizeBeforeDelete = sleepRecordRepository.findAll().size();

        // Delete the sleepRecord
        restSleepRecordMockMvc
            .perform(delete(ENTITY_API_URL_ID, sleepRecord.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SleepRecord> sleepRecordList = sleepRecordRepository.findAll();
        assertThat(sleepRecordList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
