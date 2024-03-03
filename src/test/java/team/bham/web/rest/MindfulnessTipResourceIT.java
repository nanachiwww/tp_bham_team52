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
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.MindfulnessTip;
import team.bham.repository.MindfulnessTipRepository;

/**
 * Integration tests for the {@link MindfulnessTipResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MindfulnessTipResourceIT {

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/mindfulness-tips";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MindfulnessTipRepository mindfulnessTipRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMindfulnessTipMockMvc;

    private MindfulnessTip mindfulnessTip;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MindfulnessTip createEntity(EntityManager em) {
        MindfulnessTip mindfulnessTip = new MindfulnessTip()
            .createdDate(DEFAULT_CREATED_DATE)
            .title(DEFAULT_TITLE)
            .content(DEFAULT_CONTENT);
        return mindfulnessTip;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MindfulnessTip createUpdatedEntity(EntityManager em) {
        MindfulnessTip mindfulnessTip = new MindfulnessTip()
            .createdDate(UPDATED_CREATED_DATE)
            .title(UPDATED_TITLE)
            .content(UPDATED_CONTENT);
        return mindfulnessTip;
    }

    @BeforeEach
    public void initTest() {
        mindfulnessTip = createEntity(em);
    }

    @Test
    @Transactional
    void createMindfulnessTip() throws Exception {
        int databaseSizeBeforeCreate = mindfulnessTipRepository.findAll().size();
        // Create the MindfulnessTip
        restMindfulnessTipMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mindfulnessTip))
            )
            .andExpect(status().isCreated());

        // Validate the MindfulnessTip in the database
        List<MindfulnessTip> mindfulnessTipList = mindfulnessTipRepository.findAll();
        assertThat(mindfulnessTipList).hasSize(databaseSizeBeforeCreate + 1);
        MindfulnessTip testMindfulnessTip = mindfulnessTipList.get(mindfulnessTipList.size() - 1);
        assertThat(testMindfulnessTip.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testMindfulnessTip.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testMindfulnessTip.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    @Transactional
    void createMindfulnessTipWithExistingId() throws Exception {
        // Create the MindfulnessTip with an existing ID
        mindfulnessTip.setId(1L);

        int databaseSizeBeforeCreate = mindfulnessTipRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMindfulnessTipMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mindfulnessTip))
            )
            .andExpect(status().isBadRequest());

        // Validate the MindfulnessTip in the database
        List<MindfulnessTip> mindfulnessTipList = mindfulnessTipRepository.findAll();
        assertThat(mindfulnessTipList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCreatedDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = mindfulnessTipRepository.findAll().size();
        // set the field null
        mindfulnessTip.setCreatedDate(null);

        // Create the MindfulnessTip, which fails.

        restMindfulnessTipMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mindfulnessTip))
            )
            .andExpect(status().isBadRequest());

        List<MindfulnessTip> mindfulnessTipList = mindfulnessTipRepository.findAll();
        assertThat(mindfulnessTipList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = mindfulnessTipRepository.findAll().size();
        // set the field null
        mindfulnessTip.setTitle(null);

        // Create the MindfulnessTip, which fails.

        restMindfulnessTipMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mindfulnessTip))
            )
            .andExpect(status().isBadRequest());

        List<MindfulnessTip> mindfulnessTipList = mindfulnessTipRepository.findAll();
        assertThat(mindfulnessTipList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMindfulnessTips() throws Exception {
        // Initialize the database
        mindfulnessTipRepository.saveAndFlush(mindfulnessTip);

        // Get all the mindfulnessTipList
        restMindfulnessTipMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mindfulnessTip.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())));
    }

    @Test
    @Transactional
    void getMindfulnessTip() throws Exception {
        // Initialize the database
        mindfulnessTipRepository.saveAndFlush(mindfulnessTip);

        // Get the mindfulnessTip
        restMindfulnessTipMockMvc
            .perform(get(ENTITY_API_URL_ID, mindfulnessTip.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mindfulnessTip.getId().intValue()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMindfulnessTip() throws Exception {
        // Get the mindfulnessTip
        restMindfulnessTipMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMindfulnessTip() throws Exception {
        // Initialize the database
        mindfulnessTipRepository.saveAndFlush(mindfulnessTip);

        int databaseSizeBeforeUpdate = mindfulnessTipRepository.findAll().size();

        // Update the mindfulnessTip
        MindfulnessTip updatedMindfulnessTip = mindfulnessTipRepository.findById(mindfulnessTip.getId()).get();
        // Disconnect from session so that the updates on updatedMindfulnessTip are not directly saved in db
        em.detach(updatedMindfulnessTip);
        updatedMindfulnessTip.createdDate(UPDATED_CREATED_DATE).title(UPDATED_TITLE).content(UPDATED_CONTENT);

        restMindfulnessTipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMindfulnessTip.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMindfulnessTip))
            )
            .andExpect(status().isOk());

        // Validate the MindfulnessTip in the database
        List<MindfulnessTip> mindfulnessTipList = mindfulnessTipRepository.findAll();
        assertThat(mindfulnessTipList).hasSize(databaseSizeBeforeUpdate);
        MindfulnessTip testMindfulnessTip = mindfulnessTipList.get(mindfulnessTipList.size() - 1);
        assertThat(testMindfulnessTip.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testMindfulnessTip.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testMindfulnessTip.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void putNonExistingMindfulnessTip() throws Exception {
        int databaseSizeBeforeUpdate = mindfulnessTipRepository.findAll().size();
        mindfulnessTip.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMindfulnessTipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mindfulnessTip.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mindfulnessTip))
            )
            .andExpect(status().isBadRequest());

        // Validate the MindfulnessTip in the database
        List<MindfulnessTip> mindfulnessTipList = mindfulnessTipRepository.findAll();
        assertThat(mindfulnessTipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMindfulnessTip() throws Exception {
        int databaseSizeBeforeUpdate = mindfulnessTipRepository.findAll().size();
        mindfulnessTip.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMindfulnessTipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mindfulnessTip))
            )
            .andExpect(status().isBadRequest());

        // Validate the MindfulnessTip in the database
        List<MindfulnessTip> mindfulnessTipList = mindfulnessTipRepository.findAll();
        assertThat(mindfulnessTipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMindfulnessTip() throws Exception {
        int databaseSizeBeforeUpdate = mindfulnessTipRepository.findAll().size();
        mindfulnessTip.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMindfulnessTipMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mindfulnessTip)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MindfulnessTip in the database
        List<MindfulnessTip> mindfulnessTipList = mindfulnessTipRepository.findAll();
        assertThat(mindfulnessTipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMindfulnessTipWithPatch() throws Exception {
        // Initialize the database
        mindfulnessTipRepository.saveAndFlush(mindfulnessTip);

        int databaseSizeBeforeUpdate = mindfulnessTipRepository.findAll().size();

        // Update the mindfulnessTip using partial update
        MindfulnessTip partialUpdatedMindfulnessTip = new MindfulnessTip();
        partialUpdatedMindfulnessTip.setId(mindfulnessTip.getId());

        restMindfulnessTipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMindfulnessTip.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMindfulnessTip))
            )
            .andExpect(status().isOk());

        // Validate the MindfulnessTip in the database
        List<MindfulnessTip> mindfulnessTipList = mindfulnessTipRepository.findAll();
        assertThat(mindfulnessTipList).hasSize(databaseSizeBeforeUpdate);
        MindfulnessTip testMindfulnessTip = mindfulnessTipList.get(mindfulnessTipList.size() - 1);
        assertThat(testMindfulnessTip.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testMindfulnessTip.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testMindfulnessTip.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    @Transactional
    void fullUpdateMindfulnessTipWithPatch() throws Exception {
        // Initialize the database
        mindfulnessTipRepository.saveAndFlush(mindfulnessTip);

        int databaseSizeBeforeUpdate = mindfulnessTipRepository.findAll().size();

        // Update the mindfulnessTip using partial update
        MindfulnessTip partialUpdatedMindfulnessTip = new MindfulnessTip();
        partialUpdatedMindfulnessTip.setId(mindfulnessTip.getId());

        partialUpdatedMindfulnessTip.createdDate(UPDATED_CREATED_DATE).title(UPDATED_TITLE).content(UPDATED_CONTENT);

        restMindfulnessTipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMindfulnessTip.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMindfulnessTip))
            )
            .andExpect(status().isOk());

        // Validate the MindfulnessTip in the database
        List<MindfulnessTip> mindfulnessTipList = mindfulnessTipRepository.findAll();
        assertThat(mindfulnessTipList).hasSize(databaseSizeBeforeUpdate);
        MindfulnessTip testMindfulnessTip = mindfulnessTipList.get(mindfulnessTipList.size() - 1);
        assertThat(testMindfulnessTip.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testMindfulnessTip.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testMindfulnessTip.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void patchNonExistingMindfulnessTip() throws Exception {
        int databaseSizeBeforeUpdate = mindfulnessTipRepository.findAll().size();
        mindfulnessTip.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMindfulnessTipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mindfulnessTip.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mindfulnessTip))
            )
            .andExpect(status().isBadRequest());

        // Validate the MindfulnessTip in the database
        List<MindfulnessTip> mindfulnessTipList = mindfulnessTipRepository.findAll();
        assertThat(mindfulnessTipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMindfulnessTip() throws Exception {
        int databaseSizeBeforeUpdate = mindfulnessTipRepository.findAll().size();
        mindfulnessTip.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMindfulnessTipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mindfulnessTip))
            )
            .andExpect(status().isBadRequest());

        // Validate the MindfulnessTip in the database
        List<MindfulnessTip> mindfulnessTipList = mindfulnessTipRepository.findAll();
        assertThat(mindfulnessTipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMindfulnessTip() throws Exception {
        int databaseSizeBeforeUpdate = mindfulnessTipRepository.findAll().size();
        mindfulnessTip.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMindfulnessTipMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mindfulnessTip))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MindfulnessTip in the database
        List<MindfulnessTip> mindfulnessTipList = mindfulnessTipRepository.findAll();
        assertThat(mindfulnessTipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMindfulnessTip() throws Exception {
        // Initialize the database
        mindfulnessTipRepository.saveAndFlush(mindfulnessTip);

        int databaseSizeBeforeDelete = mindfulnessTipRepository.findAll().size();

        // Delete the mindfulnessTip
        restMindfulnessTipMockMvc
            .perform(delete(ENTITY_API_URL_ID, mindfulnessTip.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MindfulnessTip> mindfulnessTipList = mindfulnessTipRepository.findAll();
        assertThat(mindfulnessTipList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
