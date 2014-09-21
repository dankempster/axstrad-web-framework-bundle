<?php
/**
 * @package Axstrad\WebFrameworkBundle
 * @subpackage Tests
 */
namespace Axstrad\Bundle\WebFrameworkBundle\Tests\Twig;

use Axstrad\Bundle\WebFrameworkBundle\Twig\Extension;


/**
 * @group unittests
 */
class ExtensionTest extends \PHPUnit_Framework_TestCase
{
    CONST EXT_NAME = 'axstrad_twig_extension';

    protected $fixture;

    public function setUp()
    {
        $this->fixture = new Extension;
    }

    /**
     * @covers Axstrad\Bundle\WebFrameworkBundle\Twig\Extension::getName
     */
    public function testCorrectName()
    {
        $this->assertEquals(
            self::EXT_NAME,
            $this->fixture->getName()
        );
    }

    /**
     * @dataProvider filtersExtendTwigTestData
     */
    public function testFiltersExtendTwig($key, $filter)
    {
        $this->assertInstanceOf(
            'Twig_Filter',
            $filter,
            "'{$key}' is not a Twig filter"
        );
    }

    /**
     * Data provider for {@see testFiltersExtendTwig}
     */
    public function filtersExtendTwigTestData()
    {
        $this->setUp();
        $filters = $this->fixture->getFilters();

        $testData = array();
        foreach ($filters as $key => $filter) {
            $testData[] = array($key, $filter);
        }

        return $testData;
    }

    /**
     * @dataProvider functionsExtendTwigTestData
     */
    public function testFunctionsExtendTwig($key, $function)
    {
        $this->assertInstanceOf(
            'Twig_Function',
            $function,
            "'{$key}' is not a Twig filter"
        );
    }

    /**
     * Data provider for {@see testFunctionsExtendTwig}
     */
    public function functionsExtendTwigTestData()
    {
        $this->setUp();
        $functions = $this->fixture->getFunctions();

        $testData = array();
        foreach ($functions as $key => $function) {
            $testData[] = array($key, $function);
        }

        return $testData;
    }

    /**
     * @covers Axstrad\Bundle\WebFrameworkBundle\Twig\Extension::getFilters
     */
    public function testProvidesCapitaliseFilter()
    {
        $this->assertArrayHasKey(
            'capitalise',
            $filters = $this->fixture->getFilters()
        );
    }

    /**
     * @covers Axstrad\Bundle\WebFrameworkBundle\Twig\Extension::getFilters
     */
    public function testProvidesUcwordsFilter()
    {
        $this->assertArrayHasKey(
            'capitalise',
            $filters = $this->fixture->getFilters()
        );
    }

    /**
     * @covers Axstrad\Bundle\WebFrameworkBundle\Twig\Extension::capitalise
     */
    public function testCaptialiseMethodWorks()
    {
        $this->assertEquals(
            'Hello World',
            $this->fixture->capitalise('hello WORLD')
        );
    }

    /**
     * @uses Axstrad\Bundle\WebFrameworkBundle\Twig\Extension::getFilters
     * @depends testProvidesCapitaliseFilter
     */
    public function testCapitaliseFilterUsesCapitaliseMethod()
    {
        $filters = $this->fixture->getFilters();
        $this->assertRegExp(
            '/\''.self::EXT_NAME.'\'\)->capitalise/',
            $filters['capitalise']->compile()
        );
    }

    /**
     * @uses Axstrad\Bundle\WebFrameworkBundle\Twig\Extension::getFilters
     * @depends testProvidesCapitaliseFilter
     */
    public function testUcWordsFilterUsesUcwordsPhpFunction()
    {
        $filters = $this->fixture->getFilters();
        $this->assertEquals(
            'ucwords',
            $filters['ucwords']->compile()
        );
    }

    /**
     * @uses Axstrad\Bundle\WebFrameworkBundle\Twig\Extension::getFunctions
     * @depends testProvidesCapitaliseFilter
     */
    public function testWrapSubstrFunctionsUsesAxstradUtility()
    {
        $functions = $this->fixture->getFunctions();
        $this->assertEquals(
            'Axstrad\Common\Util\StrUtil::wrapSubstr',
            $functions['wrapsubstr']->compile()
        );
    }
}
