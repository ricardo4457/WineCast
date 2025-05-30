import unittest
from app.rules.vineyard_rules import VineyardRules

class TestVineyardRules(unittest.TestCase):
    def test_check_irrigation(self):
        # Teste com necessidade de rega
        self.assertTrue(VineyardRules.check_irrigation(28, 50, 0))
        # Teste sem necessidade de rega
        self.assertFalse(VineyardRules.check_irrigation(22, 50, 0))
        self.assertFalse(VineyardRules.check_irrigation(28, 70, 0))
        self.assertFalse(VineyardRules.check_irrigation(28, 50, 2))

    def test_check_fungus_risk(self):
        # Teste com risco
        self.assertTrue(VineyardRules.check_fungus_risk(85, 20, 2))
        # Teste sem risco
        self.assertFalse(VineyardRules.check_fungus_risk(70, 20, 2))
        self.assertFalse(VineyardRules.check_fungus_risk(85, 30, 2))
        self.assertFalse(VineyardRules.check_fungus_risk(85, 20, 0))

if __name__ == '__main__':
    unittest.main()