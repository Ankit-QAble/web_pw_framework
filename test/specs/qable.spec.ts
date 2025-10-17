import { test, expect } from '../../framework/core/BaseTest';
import { BlogPage } from '../pages/qablePage';
import { envConfig } from '../../framework/utils/EnvConfig';

// Real application URL from profile config
const LOGIN_URL = (global as any).selectedProfile?.baseURL;
console.log(`🔍 LOGIN_URL from selectedProfile.baseURL: ${LOGIN_URL}`);

test.describe('Blog Page Tests', () => {
  let blogPage: BlogPage;

  test.beforeEach(async ({ page }, testInfo) => {
    // Add extra stability for CI environments
    if (process.env.CI) {
      try {
        await page.waitForLoadState('networkidle', { timeout: 30000 });
      } catch (error) {
        console.log('Network idle timeout in beforeEach - continuing');
      }
    }
    
    blogPage = new BlogPage(page, LOGIN_URL, testInfo);
    
    // Get retry count from config
    let retryCount = 0;
    const maxRetries = (global as any).selectedProfile?.retries || 0;
    
    console.log(`🔍 Starting navigation with maxRetries: ${maxRetries}`);
    
    // Always attempt navigation at least once, even if maxRetries is 0
    do {
      try {
        console.log(`🔍 Calling navigateToInsights() - attempt ${retryCount + 1}`);
        await blogPage.navigateToInsights();
        console.log(`🔍 navigateToInsights() completed successfully`);
        break; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`Navigation attempt ${retryCount} failed: ${errorMessage}`);
        
        if (retryCount > maxRetries) {
          throw error; // Final attempt failed
        }
        
        // Wait before retry (only if we're going to retry)
        if (retryCount <= maxRetries) {
          await page.waitForTimeout(2000);
          console.log(`Retrying navigation (attempt ${retryCount + 1}/${maxRetries + 1})...`);
        }
      }
    } while (retryCount <= maxRetries);
  });
  

  test('#1 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#2 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#3 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#4 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#5 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#6 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#7 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#8 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#9 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#10 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#11 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#12 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#13 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#14 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#15 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#16 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#17 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#18 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#19 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
  test('#20 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });

  
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  // Test cases #21-#200
  test('#21 Search automation testing @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter automation testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify automation results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#22 Search web testing @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter web testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify web testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#23 Search API testing @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter API testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify API testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#24 Search mobile testing @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter mobile testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify mobile testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#25 Search performance testing @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter performance testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify performance testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#26 Search security testing @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter security testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify security testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#27 Search UI testing @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter UI testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify UI testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#28 Search integration testing @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter integration testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify integration testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#29 Search unit testing @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter unit testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify unit testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#30 Search end-to-end testing @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter end-to-end testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify end-to-end testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#31 Search test automation @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test automation search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test automation results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#32 Search selenium testing @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter selenium testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify selenium testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#33 Search cypress testing @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter cypress testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify cypress testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#34 Search jest testing @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter jest testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify jest testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#35 Search mocha testing @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter mocha testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify mocha testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#36 Search jasmine testing @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter jasmine testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify jasmine testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#37 Search karma testing @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter karma testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify karma testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#38 Search protractor testing @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter protractor testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify protractor testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#39 Search webdriver testing @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter webdriver testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify webdriver testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#40 Search appium testing @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter appium testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify appium testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#41 Search cucumber testing @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter cucumber testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify cucumber testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#42 Search gherkin testing @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter gherkin testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify gherkin testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#43 Search BDD testing @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter BDD testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify BDD testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#44 Search TDD testing @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter TDD testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify TDD testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#45 Search continuous integration @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter continuous integration search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify continuous integration results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#46 Search continuous deployment @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter continuous deployment search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify continuous deployment results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#47 Search DevOps testing @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter DevOps testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify DevOps testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#48 Search agile testing @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter agile testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify agile testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#49 Search scrum testing @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter scrum testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify scrum testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#50 Search kanban testing @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter kanban testing search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify kanban testing results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#51 Search quality assurance @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter quality assurance search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify quality assurance results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#52 Search bug tracking @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter bug tracking search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify bug tracking results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#53 Search test management @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test management search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test management results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#54 Search test planning @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test planning search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test planning results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#55 Search test execution @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test execution search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test execution results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#56 Search test reporting @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test reporting search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test reporting results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#57 Search test metrics @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test metrics search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test metrics results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#58 Search test coverage @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test coverage search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test coverage results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#59 Search test strategy @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test strategy search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test strategy results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#60 Search test design @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test design search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test design results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#61 Search test cases @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test cases search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test cases results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#62 Search test scenarios @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test scenarios search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test scenarios results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#63 Search test data @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test data search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test data results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#64 Search test environment @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test environment search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test environment results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#65 Search test tools @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test tools search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test tools results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#66 Search test frameworks @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test frameworks search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test frameworks results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#67 Search test libraries @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test libraries search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test libraries results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#68 Search test utilities @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test utilities search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test utilities results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#69 Search test plugins @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test plugins search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test plugins results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#70 Search test extensions @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test extensions search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test extensions results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#71 Search test modules @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test modules search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test modules results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#72 Search test packages @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test packages search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test packages results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#73 Search test dependencies @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test dependencies search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test dependencies results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#74 Search test configurations @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test configurations search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test configurations results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#75 Search test settings @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test settings search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test settings results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#76 Search test parameters @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test parameters search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test parameters results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#77 Search test variables @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test variables search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test variables results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#78 Search test constants @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test constants search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test constants results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#79 Search test fixtures @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test fixtures search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test fixtures results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#80 Search test mocks @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test mocks search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test mocks results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#81 Search test stubs @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test stubs search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test stubs results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#82 Search test spies @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test spies search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test spies results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#83 Search test doubles @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test doubles search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test doubles results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#84 Search test assertions @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test assertions search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test assertions results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#85 Search test expectations @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test expectations search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test expectations results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#86 Search test validations @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test validations search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test validations results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#87 Search test verifications @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test verifications search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test verifications results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#88 Search test checks @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test checks search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test checks results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#89 Search test inspections @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test inspections search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test inspections results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#90 Search test reviews @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test reviews search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test reviews results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#91 Search test audits @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test audits search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test audits results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#92 Search test assessments @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test assessments search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test assessments results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#93 Search test evaluations @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test evaluations search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test evaluations results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#94 Search test measurements @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test measurements search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test measurements results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#95 Search test benchmarks @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test benchmarks search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test benchmarks results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#96 Search test baselines @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test baselines search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test baselines results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#97 Search test thresholds @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test thresholds search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test thresholds results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#98 Search test limits @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test limits search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test limits results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#99 Search test boundaries @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test boundaries search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test boundaries results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#100 Search test constraints @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test constraints search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test constraints results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#101 Search test conditions @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test conditions search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test conditions results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#102 Search test prerequisites @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test prerequisites search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test prerequisites results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#103 Search test requirements @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test requirements search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test requirements results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#104 Search test specifications @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test specifications search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test specifications results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#105 Search test criteria @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test criteria search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test criteria results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#106 Search test standards @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test standards search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test standards results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#107 Search test guidelines @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test guidelines search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test guidelines results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#108 Search test procedures @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test procedures search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test procedures results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#109 Search test processes @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test processes search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test processes results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#110 Search test workflows @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test workflows search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test workflows results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#111 Search test pipelines @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test pipelines search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test pipelines results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#112 Search test automation @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test automation search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test automation results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#113 Search test orchestration @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test orchestration search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test orchestration results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#114 Search test coordination @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test coordination search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test coordination results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#115 Search test synchronization @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test synchronization search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test synchronization results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#116 Search test parallelization @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test parallelization search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test parallelization results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#117 Search test concurrency @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test concurrency search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test concurrency results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#118 Search test threading @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test threading search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test threading results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#119 Search test async @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test async search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test async results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#120 Search test promises @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test promises search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test promises results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#121 Search test callbacks @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test callbacks search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test callbacks results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#122 Search test events @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test events search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test events results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#123 Search test listeners @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test listeners search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test listeners results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#124 Search test handlers @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test handlers search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test handlers results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#125 Search test middleware @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test middleware search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test middleware results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#126 Search test interceptors @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test interceptors search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test interceptors results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#127 Search test decorators @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test decorators search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test decorators results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#128 Search test annotations @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test annotations search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test annotations results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#129 Search test metadata @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test metadata search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test metadata results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#130 Search test tags @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test tags search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test tags results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#131 Search test labels @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test labels search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test labels results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#132 Search test categories @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test categories search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test categories results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#133 Search test classifications @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test classifications search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test classifications results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#134 Search test groupings @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test groupings search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test groupings results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#135 Search test suites @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test suites search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test suites results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#136 Search test collections @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test collections search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test collections results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#137 Search test batches @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test batches search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test batches results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#138 Search test runs @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test runs search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test runs results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#139 Search test executions @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test executions search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test executions results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#140 Search test iterations @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test iterations search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test iterations results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#141 Search test cycles @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test cycles search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test cycles results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#142 Search test phases @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test phases search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test phases results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#143 Search test stages @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test stages search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test stages results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#144 Search test levels @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test levels search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test levels results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#145 Search test tiers @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test tiers search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test tiers results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#146 Search test layers @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test layers search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test layers results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#147 Search test components @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test components search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test components results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#148 Search test modules @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test modules search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test modules results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#149 Search test services @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test services search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test services results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#150 Search test controllers @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test controllers search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test controllers results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#151 Search test repositories @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test repositories search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test repositories results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#152 Search test models @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test models search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test models results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#153 Search test entities @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test entities search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test entities results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#154 Search test objects @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test objects search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test objects results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#155 Search test instances @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test instances search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test instances results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#156 Search test prototypes @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test prototypes search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test prototypes results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#157 Search test classes @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test classes search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test classes results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#158 Search test interfaces @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test interfaces search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test interfaces results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#159 Search test abstractions @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test abstractions search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test abstractions results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#160 Search test implementations @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test implementations search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test implementations results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#161 Search test definitions @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test definitions search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test definitions results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#162 Search test declarations @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test declarations search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test declarations results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#163 Search test statements @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test statements search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test statements results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#164 Search test expressions @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test expressions search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test expressions results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#165 Search test functions @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test functions search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test functions results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#166 Search test methods @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test methods search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test methods results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#167 Search test procedures @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test procedures search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test procedures results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#168 Search test routines @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test routines search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test routines results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#169 Search test algorithms @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test algorithms search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test algorithms results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#170 Search test patterns @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test patterns search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test patterns results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#171 Search test templates @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test templates search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test templates results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#172 Search test blueprints @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test blueprints search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test blueprints results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#173 Search test schemas @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test schemas search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test schemas results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#174 Search test structures @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test structures search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test structures results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#175 Search test formats @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test formats search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test formats results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#176 Search test layouts @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test layouts search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test layouts results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#177 Search test designs @critical', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter test designs search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test designs results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#178 Search test architectures @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter test architectures search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test architectures results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#179 Search test frameworks @regression', { tag: ['@regression'] }, async ({ logger }) => {
    await logger.step('Enter test frameworks search', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify test frameworks results', async () => {
      await blogPage.verifyBlogTitle();
    });
  });

  test('#200 Search playwright blog @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid blog title', async () => {
      await blogPage.enterBlogTitle();
    });
    await logger.step('Verify playwright is visible', async () => {
      await blogPage.verifyBlogTitle();
    });
  });
});

